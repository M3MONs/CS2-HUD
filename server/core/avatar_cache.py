import asyncio
import logging
import xml.etree.ElementTree as ET

import httpx

STEAM_XML_URL = "https://steamcommunity.com/profiles/{steamid}/?xml=1"
logger = logging.getLogger(__name__)


class AvatarCache:
    def __init__(self) -> None:
        self._cache: dict[str, str] = {}
        self._pending: set[str] = set()
        self._lock = asyncio.Lock()

    def get(self, steamid: str) -> str | None:
        return self._cache.get(steamid)

    async def fetch(self, steamids: list[str]) -> None:
        async with self._lock:
            missing = [sid for sid in steamids if sid not in self._cache and sid not in self._pending]
            if not missing:
                return
            self._pending.update(missing)
        try:
            async with httpx.AsyncClient() as client:
                results = await asyncio.gather(
                    *[self._fetch_one(client, sid) for sid in missing],
                    return_exceptions=True,
                )
            fetched = sum(1 for r in results if r is True)
            logger.info("Fetched avatars: %d/%d", fetched, len(missing))
        finally:
            async with self._lock:
                self._pending.difference_update(missing)

    async def _fetch_one(self, client: httpx.AsyncClient, steamid: str) -> bool:
        try:
            resp = await client.get(
                STEAM_XML_URL.format(steamid=steamid),
                timeout=5.0,
            )
            resp.raise_for_status()
            root = ET.fromstring(resp.text)
            avatar = root.findtext("avatarFull", default="").strip()
            async with self._lock:
                self._cache[steamid] = avatar
            return True
        except (httpx.HTTPError, ET.ParseError) as e:
            logger.error("Avatar fetch failed for %s: %s", steamid, e)
            return False


avatar_cache = AvatarCache()
