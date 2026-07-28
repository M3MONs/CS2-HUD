import type { GSIPayload, GSIPlayer, GSIWeapon } from "@/types/gsi";

type MakePlayerOpts = {
    steamid: string;
    name: string;
    team: "CT" | "T";
    slot: number;
    health: number;
    armor: number;
    helmet: boolean;
    defusekit?: boolean;
    money: number;
    kills: number;
    deaths: number;
    assists: number;
    position: string;
    primary: GSIWeapon;
    grenades?: GSIWeapon[];
};

const knife: GSIWeapon = { name: "weapon_knife", type: "Knife", state: "holstered" };

const mockAvatar = (name: string, team: "CT" | "T"): string => {
    const initials = name
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 2)
        .toUpperCase() || "?";
    const bg = team === "CT" ? "#3b82c4" : "#c4a035";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><text x="32" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#fff">${initials}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const makePlayer = (opts: MakePlayerOpts): GSIPlayer => {
    const weapons: Record<string, GSIWeapon> = {
        weapon_0: knife,
        weapon_1: { ...opts.primary, state: "active" },
    };
    (opts.grenades ?? []).forEach((g, i) => {
        weapons[`weapon_${i + 2}`] = g;
    });

    return {
        steamid: opts.steamid,
        name: opts.name,
        avatar: mockAvatar(opts.name, opts.team),
        observer_slot: opts.slot,
        team: opts.team,
        activity: "playing",
        position: opts.position,
        forward: "0;1;0",
        state: {
            health: opts.health,
            armor: opts.armor,
            helmet: opts.helmet,
            defusekit: opts.defusekit,
            money: opts.money,
            round_kills: Math.min(opts.kills, 3),
            flashed: 0,
        },
        weapons,
        match_stats: {
            kills: opts.kills,
            deaths: opts.deaths,
            assists: opts.assists,
        },
    };
};

const he: GSIWeapon = { name: "weapon_hegrenade", type: "Grenade", state: "holstered" };
const flash: GSIWeapon = { name: "weapon_flashbang", type: "Grenade", state: "holstered" };
const smoke: GSIWeapon = { name: "weapon_smokegrenade", type: "Grenade", state: "holstered" };

const ctPlayers = [
    makePlayer({
        steamid: "76561198000000001",
        name: "s1mple",
        team: "CT",
        slot: 0,
        health: 100,
        armor: 100,
        helmet: true,
        defusekit: true,
        money: 4350,
        kills: 18,
        deaths: 9,
        assists: 4,
        position: "-400;1800;0",
        primary: {
            name: "weapon_awp",
            type: "SniperRifle",
            state: "active",
            ammo_clip: 5,
            ammo_clip_max: 10,
            ammo_reserve: 30,
        },
        grenades: [flash, smoke],
    }),
    makePlayer({
        steamid: "76561198000000002",
        name: "device",
        team: "CT",
        slot: 1,
        health: 87,
        armor: 100,
        helmet: true,
        money: 2100,
        kills: 12,
        deaths: 11,
        assists: 7,
        position: "-200;1600;0",
        primary: {
            name: "weapon_m4a1_silencer",
            type: "Rifle",
            state: "active",
            ammo_clip: 20,
            ammo_clip_max: 25,
            ammo_reserve: 75,
        },
        grenades: [he, flash],
    }),
    makePlayer({
        steamid: "76561198000000003",
        name: "NiKo",
        team: "CT",
        slot: 2,
        health: 54,
        armor: 50,
        helmet: false,
        money: 800,
        kills: 9,
        deaths: 14,
        assists: 3,
        position: "100;1400;0",
        primary: {
            name: "weapon_m4a1",
            type: "Rifle",
            state: "active",
            ammo_clip: 12,
            ammo_clip_max: 30,
            ammo_reserve: 40,
        },
        grenades: [flash],
    }),
    makePlayer({
        steamid: "76561198000000004",
        name: "ropz",
        team: "CT",
        slot: 3,
        health: 100,
        armor: 100,
        helmet: true,
        money: 5200,
        kills: 15,
        deaths: 8,
        assists: 5,
        position: "300;1200;0",
        primary: {
            name: "weapon_m4a1_silencer",
            type: "Rifle",
            state: "active",
            ammo_clip: 25,
            ammo_clip_max: 25,
            ammo_reserve: 75,
        },
        grenades: [he, smoke],
    }),
    makePlayer({
        steamid: "76561198000000005",
        name: "frozen",
        team: "CT",
        slot: 4,
        health: 23,
        armor: 0,
        helmet: false,
        money: 0,
        kills: 6,
        deaths: 16,
        assists: 2,
        position: "500;1000;0",
        primary: {
            name: "weapon_usp_silencer",
            type: "Pistol",
            state: "active",
            ammo_clip: 8,
            ammo_clip_max: 12,
            ammo_reserve: 24,
        },
    }),
];

const tPlayers = [
    makePlayer({
        steamid: "76561198000000006",
        name: "ZywOo",
        team: "T",
        slot: 5,
        health: 100,
        armor: 100,
        helmet: true,
        money: 3800,
        kills: 21,
        deaths: 7,
        assists: 2,
        position: "1800;-200;0",
        primary: {
            name: "weapon_awp",
            type: "SniperRifle",
            state: "active",
            ammo_clip: 5,
            ammo_clip_max: 10,
            ammo_reserve: 30,
        },
        grenades: [flash, smoke],
    }),
    makePlayer({
        steamid: "76561198000000007",
        name: "donk",
        team: "T",
        slot: 6,
        health: 76,
        armor: 100,
        helmet: true,
        money: 2500,
        kills: 16,
        deaths: 10,
        assists: 6,
        position: "1600;0;0",
        primary: {
            name: "weapon_ak47",
            type: "Rifle",
            state: "active",
            ammo_clip: 24,
            ammo_clip_max: 30,
            ammo_reserve: 90,
        },
        grenades: [he, flash],
    }),
    makePlayer({
        steamid: "76561198000000008",
        name: "m0NESY",
        team: "T",
        slot: 7,
        health: 100,
        armor: 100,
        helmet: true,
        money: 4100,
        kills: 14,
        deaths: 9,
        assists: 4,
        position: "1400;200;0",
        primary: {
            name: "weapon_ak47",
            type: "Rifle",
            state: "active",
            ammo_clip: 30,
            ammo_clip_max: 30,
            ammo_reserve: 90,
        },
        grenades: [smoke],
    }),
    makePlayer({
        steamid: "76561198000000009",
        name: "b1t",
        team: "T",
        slot: 8,
        health: 41,
        armor: 50,
        helmet: false,
        money: 650,
        kills: 8,
        deaths: 13,
        assists: 5,
        position: "1200;400;0",
        primary: {
            name: "weapon_galilar",
            type: "Rifle",
            state: "active",
            ammo_clip: 18,
            ammo_clip_max: 35,
            ammo_reserve: 70,
        },
        grenades: [flash],
    }),
    makePlayer({
        steamid: "76561198000000010",
        name: "jL",
        team: "T",
        slot: 9,
        health: 100,
        armor: 100,
        helmet: true,
        money: 1900,
        kills: 11,
        deaths: 12,
        assists: 8,
        position: "1000;600;0",
        primary: {
            name: "weapon_ak47",
            type: "Rifle",
            state: "active",
            ammo_clip: 15,
            ammo_clip_max: 30,
            ammo_reserve: 60,
        },
        grenades: [he, smoke],
    }),
];

const allPlayers = [...ctPlayers, ...tPlayers];

export const MOCK_LAYOUT_GSI: GSIPayload = {
    provider: { name: "Counter-Strike 2", appid: 730 },
    map: {
        name: "de_dust2",
        phase: "live",
        team_ct: { score: 7, name: "NAVI" },
        team_t: { score: 5, name: "Vitality" },
    },
    round: { phase: "live", bomb: "planted" },
    player: ctPlayers[0],
    allplayers: Object.fromEntries(allPlayers.map((p) => [p.steamid, p])),
    bomb: {
        state: "planted",
        countdown: "24.5",
        position: "1200;500;100",
    },
    phase_countdowns: {
        phase: "live",
        phase_ends_in: "87.3",
    },
};
