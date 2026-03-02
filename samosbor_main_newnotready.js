import { Instance } from "cs_script/point_script";

class MathUtils {
	static clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}
}

const RAD_TO_DEG = 180 / Math.PI;

class Vector3Utils {
	static equals(a, b) {
		return a.x === b.x && a.y === b.y && a.z === b.z;
	}
	static add(a, b) {
		return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
	}
	static subtract(a, b) {
		return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
	}
	static scale(vector, scale) {
		return new Vec3(vector.x * scale, vector.y * scale, vector.z * scale);
	}
	static multiply(a, b) {
		return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
	}
	static divide(vector, divider) {
		if (typeof divider === 'number') {
			if (divider === 0)
				throw Error('Division by zero');
			return new Vec3(vector.x / divider, vector.y / divider, vector.z / divider);
		}
		else {
			if (divider.x === 0 || divider.y === 0 || divider.z === 0)
				throw Error('Division by zero');
			return new Vec3(vector.x / divider.x, vector.y / divider.y, vector.z / divider.z);
		}
	}
	static length(vector) {
		return Math.sqrt(Vector3Utils.lengthSquared(vector));
	}
	static lengthSquared(vector) {
		return vector.x ** 2 + vector.y ** 2 + vector.z ** 2;
	}
	static length2D(vector) {
		return Math.sqrt(Vector3Utils.length2DSquared(vector));
	}
	static length2DSquared(vector) {
		return vector.x ** 2 + vector.y ** 2;
	}
	static normalize(vector) {
		const length = Vector3Utils.length(vector);
		return length ? Vector3Utils.divide(vector, length) : Vec3.Zero;
	}
	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	static cross(a, b) {
		return new Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
	}
	static inverse(vector) {
		return new Vec3(-vector.x, -vector.y, -vector.z);
	}
	static distance(a, b) {
		return Vector3Utils.subtract(a, b).length;
	}
	static distanceSquared(a, b) {
		return Vector3Utils.subtract(a, b).lengthSquared;
	}
	static floor(vector) {
		return new Vec3(Math.floor(vector.x), Math.floor(vector.y), Math.floor(vector.z));
	}
	static vectorAngles(vector) {
		let yaw = 0;
		let pitch = 0;
		if (!vector.y && !vector.x) {
			if (vector.z > 0)
				pitch = -90;
			else
				pitch = 90;
		}
		else {
			yaw = Math.atan2(vector.y, vector.x) * RAD_TO_DEG;
			pitch = Math.atan2(-vector.z, Vector3Utils.length2D(vector)) * RAD_TO_DEG;
		}
		return new Euler({
			pitch,
			yaw,
			roll: 0,
		});
	}
	static lerp(a, b, fraction, clamp = true) {
		let t = fraction;
		if (clamp) {
			t = MathUtils.clamp(t, 0, 1);
		}
		// a + (b - a) * t
		return new Vec3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
	}
	static directionTowards(a, b) {
		return Vector3Utils.subtract(b, a).normal;
	}
	static lookAt(a, b) {
		return Vector3Utils.directionTowards(a, b).eulerAngles;
	}
	static withX(vector, x) {
		return new Vec3(x, vector.y, vector.z);
	}
	static withY(vector, y) {
		return new Vec3(vector.x, y, vector.z);
	}
	static withZ(vector, z) {
		return new Vec3(vector.x, vector.y, z);
	}
}
class Vec3 {
	x;
	y;
	z;
	static Zero = new Vec3(0, 0, 0);
	constructor(xOrVector, y, z) {
		if (typeof xOrVector === 'object') {
			this.x = xOrVector.x === 0 ? 0 : xOrVector.x;
			this.y = xOrVector.y === 0 ? 0 : xOrVector.y;
			this.z = xOrVector.z === 0 ? 0 : xOrVector.z;
		}
		else {
			this.x = xOrVector === 0 ? 0 : xOrVector;
			this.y = y === 0 ? 0 : y;
			this.z = z === 0 ? 0 : z;
		}
	}
	get length() {
		return Vector3Utils.length(this);
	}
	get lengthSquared() {
		return Vector3Utils.lengthSquared(this);
	}
	get length2D() {
		return Vector3Utils.length2D(this);
	}
	get length2DSquared() {
		return Vector3Utils.length2DSquared(this);
	}
	/**
	 * Normalizes the vector (Dividing the vector by its length to have the length be equal to 1 e.g. [0.0, 0.666, 0.333])
	 */
	get normal() {
		return Vector3Utils.normalize(this);
	}
	get inverse() {
		return Vector3Utils.inverse(this);
	}
	/**
	 * Floor (Round down) each vector component
	 */
	get floored() {
		return Vector3Utils.floor(this);
	}
	/**
	 * Calculates the angles from a forward vector
	 */
	get eulerAngles() {
		return Vector3Utils.vectorAngles(this);
	}
	toString() {
		return `Vec3: [${this.x}, ${this.y}, ${this.z}]`;
	}
	equals(vector) {
		return Vector3Utils.equals(this, vector);
	}
	add(vector) {
		return Vector3Utils.add(this, vector);
	}
	subtract(vector) {
		return Vector3Utils.subtract(this, vector);
	}
	divide(vector) {
		return Vector3Utils.divide(this, vector);
	}
	scale(scaleOrVector) {
		return typeof scaleOrVector === 'number'
			? Vector3Utils.scale(this, scaleOrVector)
			: Vector3Utils.multiply(this, scaleOrVector);
	}
	multiply(scaleOrVector) {
		return typeof scaleOrVector === 'number'
			? Vector3Utils.scale(this, scaleOrVector)
			: Vector3Utils.multiply(this, scaleOrVector);
	}
	dot(vector) {
		return Vector3Utils.dot(this, vector);
	}
	cross(vector) {
		return Vector3Utils.cross(this, vector);
	}
	distance(vector) {
		return Vector3Utils.distance(this, vector);
	}
	distanceSquared(vector) {
		return Vector3Utils.distanceSquared(this, vector);
	}
	/**
	 * Linearly interpolates the vector to a point based on a 0.0-1.0 fraction
	 * Clamp limits the fraction to [0,1]
	 */
	lerpTo(vector, fraction, clamp = true) {
		return Vector3Utils.lerp(this, vector, fraction, clamp);
	}
	/**
	 * Gets the normalized direction vector pointing towards specified point (subtracting two vectors)
	 */
	directionTowards(vector) {
		return Vector3Utils.directionTowards(this, vector);
	}
	/**
	 * Returns an angle pointing towards a point from the current vector
	 */
	lookAt(vector) {
		return Vector3Utils.lookAt(this, vector);
	}
	/**
	 * Returns the same vector but with a supplied X component
	 */
	withX(x) {
		return Vector3Utils.withX(this, x);
	}
	/**
	 * Returns the same vector but with a supplied Y component
	 */
	withY(y) {
		return Vector3Utils.withY(this, y);
	}
	/**
	 * Returns the same vector but with a supplied Z component
	 */
	withZ(z) {
		return Vector3Utils.withZ(this, z);
	}
}

class EulerUtils {
	static equals(a, b) {
		return a.pitch === b.pitch && a.yaw === b.yaw && a.roll === b.roll;
	}
	static normalize(angle) {
		const normalizeAngle = (angle) => {
			angle = angle % 360;
			if (angle > 180)
				return angle - 360;
			if (angle < -180)
				return angle + 360;
			return angle;
		};
		return new Euler(normalizeAngle(angle.pitch), normalizeAngle(angle.yaw), normalizeAngle(angle.roll));
	}
	static forward(angle) {
		const pitchInRad = (angle.pitch / 180) * Math.PI;
		const yawInRad = (angle.yaw / 180) * Math.PI;
		const cosPitch = Math.cos(pitchInRad);
		return new Vec3(cosPitch * Math.cos(yawInRad), cosPitch * Math.sin(yawInRad), -Math.sin(pitchInRad));
	}
	static right(angle) {
		const pitchInRad = (angle.pitch / 180) * Math.PI;
		const yawInRad = (angle.yaw / 180) * Math.PI;
		const rollInRad = (angle.roll / 180) * Math.PI;
		const sinPitch = Math.sin(pitchInRad);
		const sinYaw = Math.sin(yawInRad);
		const sinRoll = Math.sin(rollInRad);
		const cosPitch = Math.cos(pitchInRad);
		const cosYaw = Math.cos(yawInRad);
		const cosRoll = Math.cos(rollInRad);
		return new Vec3(-1 * sinRoll * sinPitch * cosYaw + -1 * cosRoll * -sinYaw, -1 * sinRoll * sinPitch * sinYaw + -1 * cosRoll * cosYaw, -1 * sinRoll * cosPitch);
	}
	static up(angle) {
		const pitchInRad = (angle.pitch / 180) * Math.PI;
		const yawInRad = (angle.yaw / 180) * Math.PI;
		const rollInRad = (angle.roll / 180) * Math.PI;
		const sinPitch = Math.sin(pitchInRad);
		const sinYaw = Math.sin(yawInRad);
		const sinRoll = Math.sin(rollInRad);
		const cosPitch = Math.cos(pitchInRad);
		const cosYaw = Math.cos(yawInRad);
		const cosRoll = Math.cos(rollInRad);
		return new Vec3(cosRoll * sinPitch * cosYaw + -sinRoll * -sinYaw, cosRoll * sinPitch * sinYaw + -sinRoll * cosYaw, cosRoll * cosPitch);
	}
	static lerp(a, b, fraction, clamp = true) {
		let t = fraction;
		if (clamp) {
			t = MathUtils.clamp(t, 0, 1);
		}
		const lerpComponent = (start, end, t) => {
			// Calculate the shortest angular distance
			let delta = end - start;
			// Normalize delta to [-180, 180] range to find shortest path
			if (delta > 180) {
				delta -= 360;
			}
			else if (delta < -180) {
				delta += 360;
			}
			// Interpolate using the shortest path
			return start + delta * t;
		};
		// a + (b - a) * t
		return new Euler(lerpComponent(a.pitch, b.pitch, t), lerpComponent(a.yaw, b.yaw, t), lerpComponent(a.roll, b.roll, t));
	}
	static withPitch(angle, pitch) {
		return new Euler(pitch, angle.yaw, angle.roll);
	}
	static withYaw(angle, yaw) {
		return new Euler(angle.pitch, yaw, angle.roll);
	}
	static withRoll(angle, roll) {
		return new Euler(angle.pitch, angle.yaw, roll);
	}
	static rotateTowards(current, target, maxStep) {
		const rotateComponent = (current, target, step) => {
			let delta = target - current;
			if (delta > 180) {
				delta -= 360;
			}
			else if (delta < -180) {
				delta += 360;
			}
			if (Math.abs(delta) <= step) {
				return target;
			}
			else {
				return current + Math.sign(delta) * step;
			}
		};
		return new Euler(rotateComponent(current.pitch, target.pitch, maxStep), rotateComponent(current.yaw, target.yaw, maxStep), rotateComponent(current.roll, target.roll, maxStep));
	}
	static clamp(angle, min, max) {
		return new Euler(MathUtils.clamp(angle.pitch, min.pitch, max.pitch), MathUtils.clamp(angle.yaw, min.yaw, max.yaw), MathUtils.clamp(angle.roll, min.roll, max.roll));
	}
}
class Euler {
	pitch;
	yaw;
	roll;
	static Zero = new Euler(0, 0, 0);
	constructor(pitchOrAngle, yaw, roll) {
		if (typeof pitchOrAngle === 'object') {
			this.pitch = pitchOrAngle.pitch === 0 ? 0 : pitchOrAngle.pitch;
			this.yaw = pitchOrAngle.yaw === 0 ? 0 : pitchOrAngle.yaw;
			this.roll = pitchOrAngle.roll === 0 ? 0 : pitchOrAngle.roll;
		}
		else {
			this.pitch = pitchOrAngle === 0 ? pitchOrAngle : pitchOrAngle;
			this.yaw = yaw === 0 ? 0 : yaw;
			this.roll = roll === 0 ? 0 : roll;
		}
	}
	/**
	 * Returns angle with every componented clamped from -180 to 180
	 */
	get normal() {
		return EulerUtils.normalize(this);
	}
	/**
	 * Returns a normalized forward direction vector
	 */
	get forward() {
		return EulerUtils.forward(this);
	}
	/**
	 * Returns a normalized backward direction vector
	 */
	get backward() {
		return this.forward.inverse;
	}
	/**
	 * Returns a normalized right direction vector
	 */
	get right() {
		return EulerUtils.right(this);
	}
	/**
	 * Returns a normalized left direction vector
	 */
	get left() {
		return this.right.inverse;
	}
	/**
	 * Returns a normalized up direction vector
	 */
	get up() {
		return EulerUtils.up(this);
	}
	/**
	 * Returns a normalized down direction vector
	 */
	get down() {
		return this.up.inverse;
	}
	toString() {
		return `Euler: [${this.pitch}, ${this.yaw}, ${this.roll}]`;
	}
	equals(angle) {
		return EulerUtils.equals(this, angle);
	}
	/**
	 * Linearly interpolates the angle to an angle based on a 0.0-1.0 fraction
	 * Clamp limits the fraction to [0,1]
	 * ! Euler angles are not suited for interpolation, prefer to use quarternions instead
	 */
	lerp(angle, fraction, clamp = true) {
		return EulerUtils.lerp(this, angle, fraction, clamp);
	}
	/**
	 * Returns the same angle but with a supplied pitch component
	 */
	withPitch(pitch) {
		return EulerUtils.withPitch(this, pitch);
	}
	/**
	 * Returns the same angle but with a supplied yaw component
	 */
	withYaw(yaw) {
		return EulerUtils.withYaw(this, yaw);
	}
	/**
	 * Returns the same angle but with a supplied roll component
	 */
	withRoll(roll) {
		return EulerUtils.withRoll(this, roll);
	}
	/**
	 * Rotates an angle towards another angle by a specific step
	 * ! Euler angles are not suited for interpolation, prefer to use quarternions instead
	 */
	rotateTowards(angle, maxStep) {
		return EulerUtils.rotateTowards(this, angle, maxStep);
	}
	/**
	 * Clamps each component (pitch, yaw, roll) between the corresponding min and max values
	 */
	clamp(min, max) {
		return EulerUtils.clamp(this, min, max);
	}
}

let Server_MapData = {
    total_wins: "",
    fastest_win: ""
}

Instance.OnScriptInput("SaveData", ({ caller, activator }) => {
    Instance.SetSaveData(JSON.stringify(Server_MapData));
})

Instance.OnScriptInput("GetData", ({ caller, activator }) => {
    const saved_data = Instance.GetSaveData();
    Instance.Msg(saved_data)
})

const Inputs = [
    ["Admin_ResetToDefault", "OnPressed", "", ResetVariables, 0.00],
    ["Admin_HP_Sub1", "OnPressed", "1", ChangeHealth, 0.00],
    ["Admin_HP_Sub5", "OnPressed", "5", ChangeHealth, 0.00],
    ["Admin_HP_Add1", "OnPressed", "-1", ChangeHealth, 0.00],
    ["Admin_HP_Add5", "OnPressed", "-5", ChangeHealth, 0.00],
    ["Admin_MaxHP_Sub1", "OnPressed", "1", ChangeMaxHealth, 0.00],
    ["Admin_MaxHP_Sub5", "OnPressed", "5", ChangeMaxHealth, 0.00],
    ["Admin_MaxHP_Add1", "OnPressed", "-1", ChangeMaxHealth, 0.00],
    ["Admin_MaxHP_Add5", "OnPressed", "-5", ChangeMaxHealth, 0.00],
    ["Admin_Traps_Sub1", "OnPressed", "1", ChangeTrapsAmount, 0.00],
    ["Admin_Traps_Sub5", "OnPressed", "5", ChangeTrapsAmount, 0.00],
    ["Admin_Traps_Add1", "OnPressed", "-1", ChangeTrapsAmount, 0.00],
    ["Admin_Traps_Add5", "OnPressed", "-5", ChangeTrapsAmount, 0.00],
    ["Admin_NPCs_Sub1", "OnPressed", "1", ChangeNPCsAmount, 0.00],
    ["Admin_NPCs_Sub5", "OnPressed", "5", ChangeNPCsAmount, 0.00],
    ["Admin_NPCs_Add1", "OnPressed", "-1", ChangeNPCsAmount, 0.00],
    ["Admin_NPCs_Add5", "OnPressed", "-5", ChangeNPCsAmount, 0.00],
    ["Admin_ExitGlow_Disable", "OnPressed", "0", ChangeExitGlow, 0.00],
    ["Admin_ExitGlow_Enable", "OnPressed", "1", ChangeExitGlow, 0.00],
    ["Admin_LightningStrikes_Disable", "OnPressed", "0", ChangeLightningStrikes, 0.00],
    ["Admin_LightningStrikes_Enable", "OnPressed", "1", ChangeLightningStrikes, 0.00],
    ["Admin_FallDamage_Disable", "OnPressed", "0", ChangeFallDamage, 0.00],
    ["Admin_FallDamage_Enable", "OnPressed", "1", ChangeFallDamage, 0.00],
    ["Admin_FakeExits_Disable", "OnPressed", "0", ChangeFakeExits, 0.00],
    ["Admin_FakeExits_Enable", "OnPressed", "1", ChangeFakeExits, 0.00],
    ["Admin_DeadEndChunks_Disable", "OnPressed", "0", ChangeDeadEndChunks, 0.00],
    ["Admin_DeadEndChunks_Enable", "OnPressed", "1", ChangeDeadEndChunks, 0.00],
    ["Admin_VipMode_Disable", "OnPressed", "0", ChangeVipMode, 0.00],
    ["Admin_VipMode_Enable", "OnPressed", "1", ChangeVipMode, 0.00],
    ["Admin_MaxFloors_Sub1", "OnPressed", "1", ChangeMaxFloors, 0.00],
    ["Admin_MaxFloors_Add1", "OnPressed", "-1", ChangeMaxFloors, 0.00],
]

const SKINS_LIST = [
    { number: 1, path: "characters/models/waffel/rurune_bunny/rurune.vmdl" },
    { number: 2, path: "characters/models/waffel/kipfel/kipfel_ghostcandy/kipfel_ghostcandy.vmdl" }
]

let CLIMATE_FLOOR_CHANCE = [
    { value: 0, weight: 0 },       // Normal Floor
    { value: 1, weight: 80 },       // Freezy Floor
    { value: 2, weight: 20 }        // Fiery Floor
]

let DEAD_END_CHANCE = [
    { value: 0, weight: 60 },       // FALSE
    { value: 1, weight: 40 },       // TRUE
]

let FAKE_EXIT_CHANCE = [
    { value: 0, weight: 50 },       // FALSE
    { value: 1, weight: 50 },       // TRUE
]

let BOTTLE_CHANCE = [
    { value: 0, weight: 30 },
    { value: 1, weight: 50 },
    { value: 2, weight: 15 },
    { value: 5, weight: 5 }
]

let GIFTBOX_CHANCE = [
    { value: 0, weight: 25 },
    { value: 1, weight: 15 },
    { value: 2, weight: 50 },
    { value: 3, weight: 10 }
]

const DelayedCalls = [];

let total_traps_spawned = 0;
let total_traps_activated = 0;
let total_traps_broken = 0;
let total_heals_used = 0;
let total_bottles_found = 0;

let votes = 0;
let votes_min = 10;

let pre_human_hp = 100;
let pre_human_max_hp = 170;
let pre_traps_percentage = 30;
let pre_fire_percentage = 100;
let pre_snow_percentage = 100;
let pre_npcs_percentage = 20;
let human_hp = 100;
let human_max_hp = 170;
let traps_percentage = 30;
let fire_percentage = 100;
let snow_percentage = 100;
let npcs_percentage = 20;

let pre_isVipMode = false;
let isVipMode = false;
let pre_isExitGlow = true;
let isExitGlow = false;
let pre_isFallDamage = false;
let isFallDamage = false;
let pre_isFakeExits = false;
let isFakeExits = false;
let pre_isDeadEndChunks = false;
let isDeadEndChunks = false;
let pre_isLightningStrikes = true;
let isLightningStrikes = true;
let isVoteExtreme = true;
let isVoteExtremeSucceeded = false;
let isExtremeMode = false;

let climate_fire = false;
let climate_freeze = false;

let isVipDead = false;
let VIP_PLAYER = null;

let players_in_elevator = 0;
let meat = 0;
let meat_max = 0;
let floor = 0;
let floors_min = 1;
let pre_floors_max = 6;
let floors_max = 6;
let safezone_timer = 23;

Instance.SetThink(function () {
    const now = Instance.GetGameTime();

    for (let i = DelayedCalls.length - 1; i >= 0; i--) {
        if (DelayedCalls[i].time <= now) {
            DelayedCalls[i].callback();
            DelayedCalls.splice(i, 1);
        }
    }
    Instance.SetNextThink(now + 0.01);
});

Instance.SetNextThink(Instance.GetGameTime() + 0.01);

//    ___ _                       ___ _                       
//   / __\ | __ _ ___ ___   _    / _ \ | __ _ _   _  ___ _ __ 
//  / /  | |/ _` / __/ __| (_)  / /_)/ |/ _` | | | |/ _ \ '__|
// / /___| | (_| \__ \__ \  _  / ___/| | (_| | |_| |  __/ |   
// \____/|_|\__,_|___/___/ (_) \/    |_|\__,_|\__, |\___|_|   
//                                            |___/           

const PlayerInstancesMap = new Map();
class Player {
    constructor(player, controller, name, slot)
    {
        this.player = player;
        this.controller = controller;
        this.player_name = name;
        this.slot = slot;
        this.voted_extreme = false;
        this.Mapper = false;
        this.Vip = false;
        this.Skin = "";
        this.BodyGroup = "";
    }
    SetVotedExtreme()
    {
        this.voted_extreme = true;
    }
    SetNotVotedExtreme()
    {
        this.voted_extreme = false;
    }
    SetMapper()
    {
        this.Mapper = true;
    }
    SetVip()
    {
        this.Vip = true;
    }
}

Instance.OnScriptInput("SetMapper", ({caller, activator}) => {
    if(activator)
    {
        const player = activator;
        const player_controller = player?.GetPlayerController();
        const player_slot = player_controller?.GetPlayerSlot();
        const inst = PlayerInstancesMap.get(player_slot);
        if(inst && !inst.Mapper) 
        {
            inst.SetMapper();
        }
    }
});

Instance.OnScriptInput("SetVip", ({caller, activator}) => {
    if(activator)
    {
        const player = activator;
        const player_controller = player?.GetPlayerController();
        const player_slot = player_controller?.GetPlayerSlot();
        const inst = PlayerInstancesMap.get(player_slot);
        if(inst && !inst.Vip) 
        {
            inst.SetVip();
        }
    }
});

//    __                 _       
//   /__\_   _____ _ __ | |_ ___ 
//  /_\ \ \ / / _ \ '_ \| __/ __|
// //__  \ V /  __/ | | | |_\__ \
// \__/   \_/ \___|_| |_|\__|___/

Instance.OnPlayerDisconnect((event) => {
    let player_slot = event.playerSlot
    const inst = PlayerInstancesMap.get(player_slot);
    PlayerInstancesMap.delete(event.playerSlot);
    if(isVoteExtreme)
    {
        if(inst.voted_extreme)
        {
            votes--
        }
        let players_amount = Instance.FindEntitiesByClass("player");
        let players_needed = (players_amount.length/100) * 80;
        players_needed = Math.ceil(players_needed);
        if(players_needed <= votes_min)
        {
            players_needed = votes_min;
        }
        if(players_needed >= 51)
        {
            players_needed = 51;
        }
        if(votes >= players_needed)
        {
            isVoteExtreme = false;
            isVoteExtremeSucceeded = true;
            votes = 0;
            Instance.EntFireAtName({ name: "cmd", input: "Command", value: "say Voting for Extreme Mode has been Disabled.", delay: 0.50 });
        }
    }
});

Instance.OnPlayerReset((event) => {
    const player = event.player;
    if(player?.IsValid())
    {
        const player_controller = player?.GetPlayerController();
        const player_name = player_controller?.GetPlayerName();
        const player_slot = player_controller?.GetPlayerSlot();
        Instance.EntFireAtTarget({ target: player, input: "Alpha", value: "255" });
        Instance.EntFireAtTarget({ target: player, input: "Color", value: "255 255 255" });
        Instance.EntFireAtTarget({ target: player, input: "KeyValue", value: "gravity 1" });
        Instance.EntFireAtTarget({ target: player, input: "SetScale", value: "1" });
        Instance.EntFireAtTarget({ target: player, input: "SetDamageFilter" });
        Instance.EntFireAtTarget({ target: player, input: "KeyValue", value: "friction 1.0" });
        Instance.EntFireAtName({ name: "SteamID_Mapper_FilterMulti", input: "TestActivator", activator: player, delay: 0.10 });
        Instance.EntFireAtName({ name: "SteamID_Vip_FilterMulti", input: "TestActivator", activator: player, delay: 0.10 });
        Instance.EntFireAtName({ name: "SteamID_Leader_FilterMulti", input: "TestActivator", activator: player, delay: 0.10 });
        if(PlayerInstancesMap.has(player_slot))
        {
            const inst = PlayerInstancesMap.get(player_slot);
            inst.player = player;
            inst.controller = player_controller;
            inst.name = player_name;
            if(inst.Mapper || inst.Vip)
            {
                if(inst.Skin != "" && player.GetTeamNumber() === 3)
                {
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetModel", value: inst.Skin, delay: 1.00 });
                }
                if(inst.BodyGroup == "1" && player.GetTeamNumber() === 3)
                {
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_armlets,0" });
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_thighs,0" });
                }
                if(inst.BodyGroup == "2" && player.GetTeamNumber() === 3)
                {
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_armlets,1" });
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_thighs,1" });
                }
                if(inst.BodyGroup == "3" && player.GetTeamNumber() === 3)
                {
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_armlets,1" });
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_thighs,0" });
                }
            }
        } 
        else 
        {
            PlayerInstancesMap.set(player_slot, new Player(player, player_controller, player_name, player_slot));
        }
    }
});

Instance.OnRoundStart(() => {

    ResetScript();
    DelayedCalls.length = 0;
    if(isVoteExtremeSucceeded)
    {
        isExtremeMode = true;
    }
    Instance.EntFireAtName({ name: "cmd", input: "Command", value: "sv_disable_radar 0", delay: 1.00 });
    Instance.EntFireAtName({ name: "Map_Floor_Postprocessing", input: "Disable", value: "", delay: 0.00 });
    Instance.EntFireAtName({ name: "Map_Floor_Freeze_Postprocessing", input: "Disable", value: "", delay: 0.00 });
    Instance.EntFireAtName({ name: "Map_Floor_Fire_Postprocessing", input: "Disable", value: "", delay: 0.00 });
    if(isExtremeMode)
    {
        traps_percentage = 70;
        //meat_max = 9;
        //floors_max = 7;
    }
    if(Inputs.length > 0)
    {
        for (let i = 0; i < Inputs.length; i++) 
        {
            const [entName, outputName, param, handlerFn, delay] = Inputs[i];

            const ent = Instance.FindEntityByName(entName);
            if(!ent || !ent?.IsValid())
            {
                Instance.Msg("Can't Find: "+entName);
                continue;
            } 

            Instance.Msg(`Add Output to: ${entName} | OutputName: ${outputName} | Param: ${param} | Func: ${handlerFn.name} | Delay: ${delay}`);

            Instance.ConnectOutput(ent, outputName, ({value = param, caller, activator}) => {
                Delay(function () {
                    handlerFn(value);
                }, delay);
            });
        }
    }
    let players = Instance.FindEntitiesByClass("player")
    if(players.length > 0)
    {
        for(let i = 0; i < players.length; i++)
        {
            let player = players[i]
            let player_controller = player?.GetPlayerController();
            let player_slot = player_controller.GetPlayerSlot();
            const inst = PlayerInstancesMap.get(player_slot);
            if(inst.voted_extreme)
            {
                inst.SetNotVotedExtreme();
            }
        }
    }
});

Instance.OnRoundEnd(() => {
    ResetScript();
    DelayedCalls.length = 0;
});

Instance.OnBeforePlayerDamage((event) => {
    let inflictor = event.inflictor;
    if (inflictor?.GetClassName() == "prop_physics" || inflictor?.GetClassName() == "prop_physics_override" || inflictor?.GetClassName() == "func_physbox") {
        let damage = 0;
        return { damage };
    }
});

//    ___ _           _       ___                                          _     
//   / __\ |__   __ _| |_    / __\___  _ __ ___  _ __ ___   __ _ _ __   __| |___ 
//  / /  | '_ \ / _` | __|  / /  / _ \| '_ ` _ \| '_ ` _ \ / _` | '_ \ / _` / __|
// / /___| | | | (_| | |_  / /__| (_) | | | | | | | | | | | (_| | | | | (_| \__ \
// \____/|_| |_|\__,_|\__| \____/\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|\__,_|___/

Instance.OnPlayerChat((event) => {
    let player_controller = event.player
    if (!player_controller?.IsValid() || player_controller == undefined || !player_controller.GetPlayerPawn()?.IsValid() || !player_controller.IsAlive()) {
        return;
    }
    const player_slot = player_controller?.GetPlayerSlot();
    const inst = PlayerInstancesMap.get(player_slot);
    const player_text = event.text.toLowerCase();
    if(player_text.includes("!m_traps") && inst.Mapper)
    {
        const text = player_text.split(' ');
        const chance = Number(text[1]);
        if(Number.isInteger(chance) && chance >= 0 && chance <= 100)
        {
            traps_percentage = chance;
        }
    }
    if(player_text.includes("!m_rr") && inst.Mapper)
    {
        Instance.EntFireAtName({ name: "Map_Parameters", input: "FireWinCondition", value: "10", delay: 0.00 });
    }
    if(player_text.includes("!m_skin"))
    {
        if(inst.Mapper)
        {
            const text = player_text.split(' ');
            if(Number(text[1]) && Number(text[1]) > 0 && Number.isInteger(Number(text[1])) && Number(text[1]) <= SKINS_LIST.length)
            {
                let skin_path = SKINS_LIST.find(item => item.number == Number(text[1]))
                inst.Skin = skin_path?.path
                if(inst.player.GetTeamNumber() === 3)
                {
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetModel", value: `${skin_path?.path}` });
                }
            }
        }
        if(inst.Vip && !inst.Mapper)
        {
            const text = player_text.split(' ');
            if(Number(text[1]) && Number(text[1]) > 0 && Number(text[1]) < 2 && Number.isInteger(Number(text[1])) && Number(text[1]) <= SKINS_LIST.length)
            {
                let skin_path = SKINS_LIST.find(item => item.number == Number(text[1]))
                inst.Skin = skin_path?.path
                if(inst.player.GetTeamNumber() === 3)
                {
                    Instance.EntFireAtTarget({ target: inst.player, input: "SetModel", value: `${skin_path?.path}` });
                }
            }
        }
    }
    if(player_text.includes("!m_bgset"))
    {
        if(inst.Mapper && inst.player.GetTeamNumber() === 3)
        {
            const text = player_text.split(' ');
            if(Number(text[1]) && Number(text[1]) > 0 && Number.isInteger(Number(text[1])) && Number(text[1]) == 1)
            {
                inst.BodyGroup = "1"
                Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_armlets,0" });
                Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_thighs,0" });
            }
            if(Number(text[1]) && Number(text[1]) > 0 && Number.isInteger(Number(text[1])) && Number(text[1]) == 2)
            {
                inst.BodyGroup = "2"
                Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_armlets,1" });
                Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_thighs,1" });
            }
            if(Number(text[1]) && Number(text[1]) > 0 && Number.isInteger(Number(text[1])) && Number(text[1]) == 3)
            {
                inst.BodyGroup = "3"
                Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_armlets,1" });
                Instance.EntFireAtTarget({ target: inst.player, input: "SetBodyGroup", value: "rurune_thighs,0" });
            }
        }
    }
});

//                         ___                 _   _                 
//   /\/\   __ _ _ __     / __\   _ _ __   ___| |_(_) ___  _ __  ___ 
//  /    \ / _` | '_ \   / _\| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
// / /\/\ \ (_| | |_) | / /  | |_| | | | | (__| |_| | (_) | | | \__ \
// \/    \/\__,_| .__/  \/    \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
//              |_|                                                  

Instance.OnScriptInput("PlayerInsideElevator", () => {
    players_in_elevator++
});

Instance.OnScriptInput("PlayerOutsideElevator", () => {
    players_in_elevator--
});

Instance.OnScriptInput("CountPlayersInElevator", ({ caller, activator }) => {
    let players = Instance.FindEntitiesByClass("player");
    if(players.length == 0) return;
    let players_human = players.filter(player => player?.GetTeamNumber() === 3);
    if(players_human.length > 0)
    {
        let players_needed = (players_human.length/100) * 60;
        let players_total = players_human.length;
        players_needed = Math.ceil(players_needed);
        if(players_in_elevator >= players_needed || players_total <= 20)
        {
            Instance.EntFireAtName({ name: "Map_Elevator_Warning", input: "HideHudHint", value: "", delay: 0.00, activator: activator });
            Instance.EntFireAtName({ name: "Elevator_Branch*", input: "Toggle", value: "", delay: 0.00 });
        }
        if(players_in_elevator <= players_needed && players_total > 20)
        {
            Instance.EntFireAtName({ name: "Map_Elevator_Warning", input: "ShowHudHint", value: "", delay: 0.00, activator: activator });
        }
    }
});

Instance.OnScriptInput("SetExitGlow", ({ caller, activator }) => {
    if(caller?.IsValid() && caller?.GetClassName() == "prop_dynamic")
    {
        if(isExitGlow)
        {
            Instance.EntFireAtTarget({ target: caller, input: "StartGlowing", value: "" });
        }
        if(!isExitGlow)
        {
            Instance.EntFireAtTarget({ target: caller, input: "StopGlowing", value: "" });
        }
    }
});

Instance.OnScriptInput("SetFloorMessage", ({ caller, activator }) => {
    if(caller?.IsValid() && caller?.GetClassName() == "point_worldtext")
    {
        if(floor != floors_max)
        {
            Instance.EntFireAtTarget({ target: caller, input: "SetMessage", value: `FLOOR ${floor}` });
        }
        if(floor == floors_max)
        {
            Instance.EntFireAtTarget({ target: caller, input: "SetMessage", value: "FLOOR ?" });
        }
    }
});

Instance.OnScriptInput("AddMeat", () => {
    meat++
    if(meat == meat_max)
    {
        Instance.EntFireAtName({ name: "cmd", input: "Command", value: `say >> ...? <<`, delay: 3.00 });
    }
});

Instance.OnScriptInput("AddBottleCount", ({ caller, activator}) => {
    if(caller?.IsValid && caller.GetClassName() == "func_button")
    {
        let caller_name = caller.GetEntityName()
        if(caller_name.includes("Golden"))
        {
            total_bottles_found + 5
        }
        else
        {
            total_bottles_found++
        }
    }
});

Instance.OnScriptInput("AddHealCount", () => {
    total_heals_used++
});

Instance.OnScriptInput("AddTrapCount", () => {
    total_traps_spawned++
});

Instance.OnScriptInput("AddTrapBrokenCount", () => {
    total_traps_broken++
});

Instance.OnScriptInput("AddTrapActivatedCount", () => {
    total_traps_activated++
});

Instance.OnScriptInput("SpawnBottle", ({ caller, activator }) => {
    if(caller?.IsValid && caller.GetClassName() == "trigger_multiple")
    {
        let caller_name = caller.GetEntityName()
        let bottle = getRandomItem(BOTTLE_CHANCE)
        let bottle_amount = BOTTLE_CHANCE.find(item => item.value == bottle)
        if(bottle_amount?.value == 0)
        {
            return;
        }
        if(bottle_amount?.value == 1)
        {
            Instance.EntFireAtName({ name: "Map_BottleCrate_Maker", input: "ForceSpawnAtEntityOrigin", value: caller_name })
        }
        if(bottle_amount?.value == 2)
        {
            Instance.EntFireAtName({ name: "Map_BottleCrate_Maker", input: "ForceSpawnAtEntityOrigin", value: caller_name })
            Instance.EntFireAtName({ name: "Map_BottleCrate_Maker", input: "ForceSpawnAtEntityOrigin", value: caller_name, delay: 0.10 })
        }
        if(bottle_amount?.value == 5)
        {
            Instance.EntFireAtName({ name: "Map_BottleCrate_Maker2", input: "ForceSpawnAtEntityOrigin", value: caller_name })
        }
    }
})

Instance.OnScriptInput("SpawnGift", ({ caller, activator }) => {
    if(caller?.IsValid && caller.GetClassName() == "trigger_multiple")
    {
        let caller_name = caller.GetEntityName()
        let gift = getRandomItem(GIFTBOX_CHANCE)
        let gift_item = GIFTBOX_CHANCE.find(item => item.value == gift)
        if(gift_item?.value == 0)
        {
            Instance.EntFireAtName({ name: "Map_GiftBox_Case", input: "InValue", value: "1" })
            Instance.EntFireAtName({ name: "Map_GiftBox_Maker", input: "ForceSpawnAtEntityOrigin", value: caller_name, delay: 0.02 })
        }
        if(gift_item?.value == 1)
        {
            Instance.EntFireAtName({ name: "Map_GiftBox_Case", input: "InValue", value: "2" })
            Instance.EntFireAtName({ name: "Map_GiftBox_Maker", input: "ForceSpawnAtEntityOrigin", value: caller_name, delay: 0.02 })
        }
        if(gift_item?.value == 2)
        {
            Instance.EntFireAtName({ name: "Map_GiftBox_Case", input: "InValue", value: "3" })
            Instance.EntFireAtName({ name: "Map_GiftBox_Maker", input: "ForceSpawnAtEntityOrigin", value: caller_name, delay: 0.02 })
        }
        if(gift_item?.value == 3)
        {
            Instance.EntFireAtName({ name: "Map_GiftBox_Case", input: "InValue", value: "4" })
            Instance.EntFireAtName({ name: "Map_GiftBox_Maker", input: "ForceSpawnAtEntityOrigin", value: caller_name, delay: 0.02 })
        }
    }
})

Instance.OnScriptInput("SpawnTrap", () => {
    let makers = Instance.FindEntitiesByClass("env_entity_maker")
    let trap_makers = makers.filter(maker => (maker.GetEntityName()).search("_Trap_Maker_") != -1)
    let traps_amount = Math.ceil(trap_makers.length/100 * traps_percentage)
    for(let i = 0; i < traps_amount; i++)
    {
        let rnd_n = GetRandomNumber(0, trap_makers.length - 1);
        let r_ent = trap_makers[rnd_n];
        if(r_ent?.IsValid())
        {
            Instance.EntFireAtTarget({ target: r_ent, input: "ForceSpawn", value: "", delay: 0.00 });
        }
        trap_makers.splice(rnd_n, 1)
    }
})

Instance.OnScriptInput("SpawnFire", () => {
    if(climate_fire)
    {
        let makers = Instance.FindEntitiesByClass("env_entity_maker")
        let trap_makers = makers.filter(maker => (maker.GetEntityName()).search("_Fire_Maker") != -1)
        let traps_amount = Math.ceil(trap_makers.length/100 * fire_percentage)
        for(let i = 0; i < traps_amount; i++)
        {
            let rnd_n = GetRandomNumber(0, trap_makers.length - 1);
            let r_ent = trap_makers[rnd_n];
            if(r_ent?.IsValid())
            {
                Instance.EntFireAtTarget({ target: r_ent, input: "ForceSpawn", value: "", delay: 0.00 });
            }
            trap_makers.splice(rnd_n, 1)
        }
    }
    if(climate_freeze)
    {
        let makers = Instance.FindEntitiesByClass("env_entity_maker")
        let trap_makers = makers.filter(maker => (maker.GetEntityName()).search("_Fire_Maker") != -1)
        let traps_amount = Math.ceil(trap_makers.length/100 * snow_percentage)
        for(let i = 0; i < traps_amount; i++)
        {
            let rnd_n = GetRandomNumber(0, trap_makers.length - 1);
            let r_ent = trap_makers[rnd_n];
            if(r_ent?.IsValid())
            {
                Instance.EntFireAtTarget({ target: r_ent, input: "KeyValue", value: "EntityTemplate Map_Snow_Template", delay: 0.00 });
                Instance.EntFireAtTarget({ target: r_ent, input: "ForceSpawn", value: "", delay: 0.02 });
            }
            trap_makers.splice(rnd_n, 1)
        }
    }
})

Instance.OnScriptInput("TeleportPlayersNextFloor", ({ caller, activator }) => {
    if(activator?.IsValid() && activator?.GetClassName() == "player")
    {
        if(floor <= floors_max - 1)
        {
            activator.Teleport({ position: {x: -527, y: 0, z: 13325}, angles: {pitch: 0, yaw: 0, roll: 0}});
        }
        if(floor > floors_max - 1 && meat < 8)      // Normal Ending
        {
            activator.Teleport({ position: {x: 7488, y: -11264, z: -12974}, angles: {pitch: 0, yaw: 0, roll: 0}});
        }
        if(floor > floors_max - 1 && meat >= 8)     // Secret Ending
        {
            activator.Teleport({ position: {x: -7200, y: -3352, z: -7748}, angles: {pitch: 0, yaw: 270, roll: 0}});
        }
    }
});

Instance.OnScriptInput("ResetHumanHealth", ({ caller, activator }) => {
    let players = Instance.FindEntitiesByClass("player")
    if(players.length > 0)
    {
        for(let i = 0; i < players.length; i++)
        {
            let player = players[i]
            if(player?.IsValid && player?.GetTeamNumber === 3)
            {
                Instance.EntFireAtTarget({ target: player, input: "KeyValue", value: "max_health " + human_max_hp, delay: 0.00 })
                Instance.EntFireAtTarget({ target: player, input: "KeyValue", value: "health " + human_hp, delay: 0.00 })
            }
        }
    }
})

Instance.OnScriptInput("PlayerVoteExtreme", ({ caller, activator }) => {
    const player = activator;
    const player_controller = player?.GetPlayerController();
    const player_slot = player_controller?.GetPlayerSlot();
    const inst = PlayerInstancesMap.get(player_slot);
    if(isVoteExtreme && !isVoteExtremeSucceeded && !inst.voted_extreme)
    {
        inst.SetVotedExtreme();
        votes++
        let players_amount = Instance.FindEntitiesByClass("player");
        let players_needed = (players_amount.length/100) * 80;
        players_needed = Math.ceil(players_needed);
        if(players_needed <= votes_min)
        {
            players_needed = votes_min;
        }
        if(players_needed >= 51)
        {
            players_needed = 51;
        }
        Instance.EntFireAtName({ name: "Map_Floor_VoteForExtreme_Hudhint", input: "ShowHudHint", value: "", delay: 0.00, activator: activator });
        if(votes >= players_needed)
        {
            Instance.EntFireAtName({ name: "Admin_*", input: "Lock", value: "", delay: 0.00 })
            ResetVariables();
            isVoteExtreme = false;
            isVoteExtremeSucceeded = true;
            votes = 0;
            Instance.EntFireAtName({ name: "cmd", input: "Command", value: "say Voting for Extreme Mode has been Disabled.", delay: 0.50 });
        }
    }
})

Instance.OnScriptInput("StartGlowstickXYZ", ({ caller, activator }) => {

    caller.vOrigin = activator.GetAbsOrigin();
    Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "Tick_GlowstickXYZ", activator: caller, delay: 0.05 });
})
Instance.OnScriptInput("Tick_GlowstickXYZ", ({ caller, activator }) => {
    if (!activator.IsValid())
    {
        return
    }
    
    const vLastOrigin = activator.vOrigin;
    const vOrigin = activator.GetAbsOrigin();

    if (vLastOrigin.x != vOrigin.x ||
        vLastOrigin.y != vOrigin.y ||
        vLastOrigin.z != vOrigin.z)
    {
        activator.vOrigin = vOrigin;
        Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "Tick_GlowstickXYZ", activator: activator, delay: 0.5 });
        return
    }
    let parent = activator.GetParent()
    let parent_coords = parent?.GetAbsOrigin()
    let new_pos =
    {
        x: parent_coords?.x,
        y: parent_coords?.y,
        z: parent_coords?.z + 4
    };
    Instance.EntFireAtTarget({ target: parent, input: "DisableMotion" })
    Instance.EntFireAtTarget({ target: activator, input: "Enable" })
    activator?.Teleport({ position: new_pos })
})

Instance.OnScriptInput("SpawnFakeElevator", () => {
    let doors = Instance.FindEntitiesByClass("func_physbox")
    let door_replace = doors.filter(doors => (doors.GetEntityName()).search("Door_Close_") != -1)
    for(let i = 0; i < 1; i++)
    {
        let rnd_n = GetRandomNumber(0, door_replace.length - 1);
        let r_ent = door_replace[rnd_n];
        let r_ent_origin = r_ent.GetAbsOrigin()
        let r_ent_angles = r_ent.GetAbsAngles()
        if(r_ent?.IsValid())
        {
            if(r_ent_origin.x >= 15340 || r_ent_origin.x <= -15340 || r_ent_origin.y >= 15340 || r_ent_origin.y <= -15340)
            {
                return;
            }
            if(r_ent_origin.x == 1024 || r_ent_origin.x == -1024 || r_ent_origin.y == 1024 || r_ent_origin.y == -1024)
            {
                return;
            }
            Instance.EntFireAtName({ name: "Map_FakeElevator_Maker", input: "KeyValue", value: `origin ${r_ent_origin.x} ${r_ent_origin.y} ${r_ent_origin.z}` });
            if(Math.round(r_ent_angles.yaw) == -180)
            {
                Instance.EntFireAtName({ name: "Map_FakeElevator_Maker", input: "KeyValue", value: `angles 0 270 0` });
            }
            else
            {
                Instance.EntFireAtName({ name: "Map_FakeElevator_Maker", input: "KeyValue", value: `angles 0 ${Math.round(r_ent_angles.yaw) - 270} 0` });
            }
            //Instance.Msg(`${Math.round(r_ent_angles.yaw) - 270}`)
            Instance.EntFireAtName({ name: "Map_FakeElevator_Maker", input: "ForceSpawn", value: "", delay: 0.02 });
            Instance.EntFireAtTarget({ target: r_ent, input: "Kill", value: "", delay: 0.04 });
        }
        door_replace.splice(rnd_n, 1)
    }
})

Instance.OnScriptInput("SpawnDeadEnd", () => {
    let doors = Instance.FindEntitiesByClass("func_physbox")
    let door_replace = doors.filter(doors => (doors.GetEntityName()).search("Door_Close_") != -1)
    for(let i = 0; i < 1; i++)
    {
        let rnd_n = GetRandomNumber(0, door_replace.length - 1);
        let r_ent = door_replace[rnd_n];
        let r_ent_origin = r_ent.GetAbsOrigin()
        let r_ent_angles = r_ent.GetAbsAngles()
        if(r_ent?.IsValid())
        {
            if(r_ent_origin.x >= 15340 || r_ent_origin.x <= -15340 || r_ent_origin.y >= 15340 || r_ent_origin.y <= -15340)
            {
                return;
            }
            if(r_ent_origin.x == 1024 || r_ent_origin.x == -1024 || r_ent_origin.y == 1024 || r_ent_origin.y == -1024)
            {
                return;
            }
            Instance.EntFireAtName({ name: "Preset_DeadEnd_Maker", input: "KeyValue", value: `origin ${r_ent_origin.x} ${r_ent_origin.y} ${r_ent_origin.z}` });
            //Instance.Msg(`ORIGINAL ORIGIN: ${r_ent_origin.x} ${r_ent_origin.y} ${r_ent_origin.z}`)
            //Instance.Msg(`ORIGINAL ANGLE: ${Math.round(r_ent_angles.yaw) - 270}`)
            if(Math.round(r_ent_angles.yaw) == -180)
            {
                Instance.EntFireAtName({ name: "Preset_DeadEnd_Maker", input: "KeyValue", value: `angles 0 270 0` });
            }
            else
            {
                Instance.EntFireAtName({ name: "Preset_DeadEnd_Maker", input: "KeyValue", value: `angles 0 ${Math.round(r_ent_angles.yaw) - 270} 0` });
            }
            Instance.EntFireAtName({ name: "Preset_DeadEnd_Maker", input: "KeyValue", value: "EntityTemplate Door_Temp" });
            Instance.EntFireAtName({ name: "Preset_DeadEnd_Maker", input: "ForceSpawn", value: "", delay: 0.02 });
            Instance.EntFireAtTarget({ target: r_ent, input: "Kill", value: "", delay: 0.04 });
            Instance.EntFireAtName({ name: "Preset_DeadEnd_Maker", input: "KeyValue", value: "EntityTemplate Temp_DeadEnd", delay: 0.04 });
            Instance.EntFireAtName({ name: "Preset_DeadEnd_Maker", input: "ForceSpawn", value: "", delay: 0.06 });
        }
        door_replace.splice(rnd_n, 1)
    }
})

Instance.OnScriptInput("SpawnFakeChunks", () => {
    let fakeexit = getRandomItem(FAKE_EXIT_CHANCE)
    let fakeexit_item = FAKE_EXIT_CHANCE.find(item => item.value == fakeexit)
    if(fakeexit_item?.value == 1)
    {
        Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "SpawnFakeElevator", delay: 0.50 });
    }
    if(isExtremeMode)
    {
        let deadend = getRandomItem(DEAD_END_CHANCE)
        let deadend_item = DEAD_END_CHANCE.find(item => item.value == deadend)
        if(deadend_item?.value == 1)
        {
            let rnd_n = GetRandomNumber(1, 2);
            if(rnd_n == 1)
            {
                Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "SpawnDeadEnd", delay: 1.00 });
            }
            if(rnd_n == 2)
            {
                Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "SpawnDeadEnd", delay: 1.00 });
                Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "SpawnDeadEnd", delay: 2.00 });
            }
        }
    }
})

Instance.OnScriptInput("SetFrictionHuman", () => {
    let players = Instance.FindEntitiesByClass("player")
    if(players.length > 0)
    {
        for(let i = 0; i < players.length; i++)
        {
            let player = players[i]
            if(player.IsValid() && player.GetTeamNumber() === 3)
            {
                Instance.EntFireAtTarget({ target: player, input: "KeyValue", value: "friction 0.2" })
            }
        }
    }
})

Instance.OnScriptInput("RemoveFrictionHuman", () => {
    let players = Instance.FindEntitiesByClass("player")
    if(players.length > 0)
    {
        for(let i = 0; i < players.length; i++)
        {
            let player = players[i]
            if(player.IsValid() && player.GetTeamNumber() === 3)
            {
                Instance.EntFireAtTarget({ target: player, input: "KeyValue", value: "friction 1.0" })
            }
        }
    }
})

Instance.OnScriptInput("CheckVipPlayer", ({ caller, activator }) => {
    if(VIP_PLAYER == null || !VIP_PLAYER?.IsValid() || !VIP_PLAYER?.IsAlive() || VIP_PLAYER?.GetTeamNumber() == 2)
    {
        isVipDead = true;
        VIP_PLAYER = null;
        Instance.ServerCommand(`say *** The VIP is dead! ***`);
        Instance.Msg(`say *** The VIP is dead! ***`)
    }
    if(!isVipDead)
    {
        Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "CheckVipPlayer", delay: 1.00 });
    }
});

//    _       _           _           __                       
//   /_\   __| |_ __ ___ (_)_ __     /__\ ___   ___  _ __ ___  
//  //_\\ / _` | '_ ` _ \| | '_ \   / \/// _ \ / _ \| '_ ` _ \ 
// /  _  \ (_| | | | | | | | | | | / _  \ (_) | (_) | | | | | |
// \_/ \_/\__,_|_| |_| |_|_|_| |_| \/ \_/\___/ \___/|_| |_| |_|

Instance.OnScriptInput("AdminReset", ({ caller, activator }) => {
    ResetVariables();
})

Instance.OnScriptInput("AdminRestartRound", ({ caller, activator }) => {
    Instance.EntFireAtName({ name: "Map_Parameters", input: "FireWinCondition", value: "10", delay: 0.00 });
})

function ChangeHealth(arg)
{
    pre_human_hp = pre_human_hp - arg;
    if(pre_human_hp > pre_human_max_hp)
    {
        pre_human_hp = pre_human_max_hp
    }
    if(pre_human_hp < 1)
    {
        pre_human_hp = 1
    }
    Instance.EntFireAtName({ name: "Admin_HP_Value", input: "SetMessage", value: pre_human_hp, delay: 0.00 })
}

function ChangeMaxHealth(arg)
{
    pre_human_max_hp = pre_human_max_hp - arg;
    if(pre_human_max_hp > 300)
    {
        pre_human_max_hp = 300
    }
    if(pre_human_max_hp < 50)
    {
        pre_human_max_hp = 50
    }
    if(pre_human_max_hp < pre_human_hp)
    {
        pre_human_hp = pre_human_max_hp
        Instance.EntFireAtName({ name: "Admin_HP_Value", input: "SetMessage", value: pre_human_hp, delay: 0.00 })
    }
    Instance.EntFireAtName({ name: "Admin_MaxHP_Value", input: "SetMessage", value: pre_human_max_hp, delay: 0.00 })
}

function ChangeTrapsAmount(arg)
{
    pre_traps_percentage = pre_traps_percentage - arg;
    if(pre_traps_percentage > 100)
    {
        pre_traps_percentage = 100
    }
    if(pre_traps_percentage < 0)
    {
        pre_traps_percentage = 0
    }
    Instance.EntFireAtName({ name: "Admin_Traps_Value", input: "SetMessage", value: pre_traps_percentage + "%", delay: 0.00 })
}

function ChangeNPCsAmount(arg)
{
    pre_npcs_percentage = pre_npcs_percentage - arg;
    if(pre_npcs_percentage > 100)
    {
        pre_npcs_percentage = 100
    }
    if(pre_npcs_percentage < 0)
    {
        pre_npcs_percentage = 0
    }
    Instance.EntFireAtName({ name: "Admin_NPCs_Value", input: "SetMessage", value: pre_npcs_percentage + "%", delay: 0.00 })
}

function ChangeExitGlow(arg)
{
    if(arg == "1")
    {
        pre_isExitGlow = true;
        Instance.EntFireAtName({ name: "Admin_ExitGlow_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })

    }
    if(arg == "0")
    {
        pre_isExitGlow = false;
        Instance.EntFireAtName({ name: "Admin_ExitGlow_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
}

function ChangeLightningStrikes(arg)
{
    if(arg == "1")
    {
        pre_isLightningStrikes = true;
        Instance.EntFireAtName({ name: "Admin_LightningStrikes_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })

    }
    if(arg == "0")
    {
        pre_isLightningStrikes = false;
        Instance.EntFireAtName({ name: "Admin_LightningStrikes_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
}

function ChangeFallDamage(arg)
{
    if(arg == "1")
    {
        pre_isFallDamage = true;
        Instance.EntFireAtName({ name: "Admin_FallDamage_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })

    }
    if(arg == "0")
    {
        pre_isFallDamage = false;
        Instance.EntFireAtName({ name: "Admin_FallDamage_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
}

function ChangeFakeExits(arg)
{
    if(arg == "1")
    {
        pre_isFakeExits = true;
        Instance.EntFireAtName({ name: "Admin_FakeExits_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })

    }
    if(arg == "0")
    {
        pre_isFakeExits = false;
        Instance.EntFireAtName({ name: "Admin_FakeExits_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
}

function ChangeDeadEndChunks(arg)
{
    if(arg == "1")
    {
        pre_isDeadEndChunks = true;
        Instance.EntFireAtName({ name: "Admin_DeadEndChunks_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })

    }
    if(arg == "0")
    {
        pre_isDeadEndChunks = false;
        Instance.EntFireAtName({ name: "Admin_DeadEndChunks_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
}

function ChangeVipMode(arg)
{
    if(arg == "1")
    {
        pre_isVipMode = true;
        Instance.EntFireAtName({ name: "Admin_VipMode_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })

    }
    if(arg == "0")
    {
        pre_isVipMode = false;
        Instance.EntFireAtName({ name: "Admin_VipMode_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
}

function ChangeMaxFloors(arg)
{
    pre_floors_max = pre_floors_max - arg;
    if(pre_floors_max > 9)
    {
        pre_floors_max = 9
    }
    if(pre_floors_max < 2)
    {
        pre_floors_max = 2
    }
    Instance.EntFireAtName({ name: "Admin_MaxFloors_Value", input: "SetMessage", value: pre_floors_max - 1, delay: 0.00 })
}

//               _           __             _      
//   /\/\   __ _(_)_ __     / /  ___   __ _(_) ___ 
//  /    \ / _` | | '_ \   / /  / _ \ / _` | |/ __|
// / /\/\ \ (_| | | | | | / /__| (_) | (_| | | (__ 
// \/    \/\__,_|_|_| |_| \____/\___/ \__, |_|\___|
//                                    |___/        

Instance.OnScriptInput("SpawnFloor", () => {
    ResetFloor();
    if(floor == 0)
    {
        UpdateVariables();
    }
    floor++
    if(floor <= floors_max - 1)
    {
        if(floor >= floors_min && floor<=floors_max)
        {
            if(floor > 3)
            {
                safezone_timer = 28;
                Instance.EntFireAtName({ name: "cmd", input: "Command", value: "say >> Zombie Cage will open in " + safezone_timer + " seconds <<", delay: 13.00 });
            }
            Instance.EntFireAtName({ name: "Map_Floor_Freeze_Postprocessing", input: "Disable", value: "", delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_Floor_Fire_Postprocessing", input: "Disable", value: "", delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_Floor_Snow_Particle", input: "DestroyImmediately", value: "", delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "RemoveFrictionHuman", delay: 6.00 });
            Instance.EntFireAtName({ name: "Map_Floor_Relay", input: "Trigger", value: "", delay: 0.00 });
            Instance.EntFireAtName({ name: "cmd", input: "Command", value: `say >> FLOOR ${floor} <<`, delay: 0.00 });
            Instance.EntFireAtName({ name: `Map_Floor${floor}_Case`, input: "PickRandom", value: "", delay: 0.00 });
            Instance.EntFireAtName({ name: `Map_FogController_Floor${floor}`, input: "Trigger", value: "", delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_Chunk_Add_Case", input: "InValue", value: floor, delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_Human_Item_Case", input: "InValue", value: floor, delay: 16.00 });
            Instance.EntFireAtName({ name: "Map_Floor_SafeZone_Doors", input: "Open", value: "", delay: 13.00 + safezone_timer });
            Instance.EntFireAtName({ name: "Map_Floor_SafeZone_BreakableDoor_Case", input: "PickRandomShuffle", value: "", delay: 12.00 + safezone_timer });
            Instance.EntFireAtName({ name: "Map_Floor_SafeZone_BreakableDoor_Case", input: "PickRandomShuffle", value: "", delay: 14.00 + safezone_timer });
            Instance.EntFireAtName({ name: "Map_Floor_SafeZone_BreakableDoor_Case", input: "PickRandomShuffle", value: "", delay: 16.00 + safezone_timer });
            Instance.EntFireAtName({ name: "Map_Items_Toggle", input: "FireUser2", value: "", delay: 13.00 + safezone_timer });
            Instance.EntFireAtName({ name: "Map_Items_Ammunition", input: "Trigger", value: "", delay: 13.00 + safezone_timer });
            if(floor <= 3)
            {
                Instance.EntFireAtName({ name: "cmd", input: "Command", value: "say >> Zombie Cage will open in " + safezone_timer + " seconds <<", delay: 13.00 });
            }
            if(floor == 1 && !isExtremeMode)
            {
                Instance.EntFireAtName({ name: "Map_Floor_DeleteTraps", input: "Trigger", value: "", delay: 13.00 });
            }
            if(floor > 1)
            {
                Instance.EntFireAtName({ name: "Map_Chunk_Branch", input: "Toggle", value: "", delay: 0.00 });
                Instance.EntFireAtName({ name: "Map_Store_Branch", input: "SetValue", value: "1", delay: 0.00 });
                Instance.EntFireAtName({ name: "Map_Store_BranchChat", input: "SetValue", value: "0", delay: 0.00 });
            }
        }

        // VIP MODE
        if(floor == 1 && isVipMode)
        {
            let players = GetValidPlayersCT();
            let rnd_player = players[GetRandomNumber(0, players.length - 1)];
            VIP_PLAYER = rnd_player;
            Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "CheckVipPlayer" });
        }

        // CLIMATE FLOOR EVENT
        let event = getRandomItem(CLIMATE_FLOOR_CHANCE)
        let event_item = CLIMATE_FLOOR_CHANCE.find(item => item.value == event)
        if(event_item?.value == 1)
        {
            climate_freeze = true;
            Instance.EntFireAtName({ name: "Map_Floor_Snow_Particle", input: "Start", value: "", delay: 9.00 })
            Instance.EntFireAtName({ name: "Map_Floor_Freeze_Postprocessing", input: "Enable", value: "", delay: 9.00 });
            Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "SetFrictionHuman", delay: 9.00 });
        }
        if(event_item?.value == 2)
        {
            climate_fire = true;
            Instance.EntFireAtName({ name: "Map_Floor_Fire_Postprocessing", input: "Enable", value: "", delay: 9.00 });
        }

        // POST PROCESSING
        if(floor >= Math.ceil((floors_max - 1) * 0.5))
        {
            Instance.EntFireAtName({ name: "Map_Floor_Postprocessing", input: "Enable", value: "", delay: 0.00 });
        }

        // TRAILS
        if(floor == 1 && !isExtremeMode)
        {
            Instance.EntFireAtName({ name: "Item_Trail_Orange_Template", input: "KeyValue", value: "origin 310 308 13400", delay: 5.00 });
            Instance.EntFireAtName({ name: "Item_Trail_Orange_Template", input: "ForceSpawn", value: "", delay: 5.05 });
        }
        if(floor == 2 && !isExtremeMode)
        {
            Instance.EntFireAtName({ name: "Item_Trail_Green_Template", input: "KeyValue", value: "origin 310 308 13400", delay: 5.00 });
            Instance.EntFireAtName({ name: "Item_Trail_Green_Template", input: "ForceSpawn", value: "", delay: 5.05 });
        }

        // LIGHTNING STRIKES
        if(isLightningStrikes)
        {
            if(!isExtremeMode)
            {
                if(floor == Math.floor((floors_max - 1) * 0.8))
                {
                    Instance.EntFireAtName({ name: "Map_Floor_Lightning_Strike_Case", input: "PickRandomShuffle", value: "", delay: 13.00 });
                }
                if(floor == floors_max - 1)
                {
                    Instance.EntFireAtName({ name: "Floor_Teleport", input: "Kill", value: "", delay: 13.00 });
                    Instance.EntFireAtName({ name: "Map_Floor_CheckTeleported", input: "Trigger", value: "", delay: 13.00 });
                    Instance.EntFireAtName({ name: "Map_WeatherEvent_Relay", input: "Trigger", value: "", delay: 13.00 });
                }
            }
            if(isExtremeMode)
            {
                Instance.EntFireAtName({ name: "Map_WeatherEvent_Relay", input: "Trigger", value: "", delay: 13.00 });
                if(floor == floors_max - 1)
                {
                    Instance.EntFireAtName({ name: "Floor_Teleport", input: "Kill", value: "", delay: 13.00 });
                    Instance.EntFireAtName({ name: "Map_Floor_CheckTeleported", input: "Trigger", value: "", delay: 13.00 });
                }
            }
        }

        // ZOMBIE ITEMS SPAWN
        if(floor > 0 && floor < floors_max)
        {
            Instance.EntFireAtName({ name: "Map_ZM_Item_Maker5", input: "ForceSpawn", value: "", delay: 3.50 });    // ADDITIONAL ITEM
        }
        if(floor > 1)
        {
            Instance.EntFireAtName({ name: "Map_ZM_Item_Case", input: "ResetShuffle", value: "", delay: 0.00 });
        }
        if(Math.floor(floor/(floors_max - 1)) <= 0.4)
        {
            Instance.EntFireAtName({ name: "Map_ZM_Item_Case", input: "PickRandomShuffle", value: "", delay: 13.00 });
        }
        if(Math.floor(floor/(floors_max - 1)) > 0.4)
        {
            Instance.EntFireAtName({ name: "Map_ZM_Item_Case", input: "PickRandomShuffle", value: "", delay: 13.00 });
            Instance.EntFireAtName({ name: "Map_ZM_Item_Case", input: "PickRandomShuffle", value: "", delay: 14.00 });
        }
        if(floor == floors_max - 1)
        {
            Instance.EntFireAtName({ name: "cmd", input: "Command", value: "sv_disable_radar 1", delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_ZM_Item_Case", input: "PickRandomShuffle", value: "", delay: 13.00 });
            Instance.EntFireAtName({ name: "Map_ZM_Item_Case", input: "PickRandomShuffle", value: "", delay: 14.00 });
            Instance.EntFireAtName({ name: "Map_ZM_Item_Case", input: "PickRandomShuffle", value: "", delay: 15.00 });
        }
    }
    if(floor == floors_max)
    {
        if(meat < meat_max)        // Normal Ending
        {
            Instance.EntFireAtName({ name: "Template_ElevatorTeleport", input: "KeyValue", value: "origin 7504 -11264 -12984", delay: 0.00 });
            Instance.EntFireAtName({ name: "Template_ElevatorTeleport", input: "ForceSpawn", value: "", delay: 0.05 });
            Instance.EntFireAtName({ name: "Map_Floor_TeleportToEnd", input: "AddOutput", value: "OnStartTouch>!activator>KeyValue>origin 7488 -11264 -12974>0>-1", delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_Floor_TeleportToEnd", input: "AddOutput", value: "OnStartTouch>!activator>KeyValue>angles 0 0 0>0>-1", delay: 0.00 });
        }
        if(meat >= meat_max)        // Secret Ending
        {
            Instance.EntFireAtName({ name: "Template_ElevatorTeleport", input: "KeyValue", value: "origin -7200 -3344 -7760", delay: 0.00 });
            Instance.EntFireAtName({ name: "Template_ElevatorTeleport", input: "KeyValue", value: "angles 0 90 0", delay: 0.05 });
            Instance.EntFireAtName({ name: "Template_ElevatorTeleport", input: "ForceSpawn", value: "", delay: 0.10 });
            Instance.EntFireAtName({ name: "Map_QuestionableEnding_Relay", input: "Trigger", value: "", delay: 0.00 });
            Instance.EntFireAtName({ name: "Map_Floor_TeleportToEnd", input: "AddOutput", value: "OnStartTouch>Map_Boss_Arena_ZM_Case>PickRandomShuffle>>0>-1", delay: 0.00 });
        }
    }
})

//         _       _     ___                     __    __                     
//   /\/\ (_)_ __ (_)   / __\ ___  ___ ___   _  / / /\ \ \___  _ __ _ __ ___  
//  /    \| | '_ \| |  /__\/// _ \/ __/ __| (_) \ \/  \/ / _ \| '__| '_ ` _ \ 
// / /\/\ \ | | | | | / \/  \ (_) \__ \__ \  _   \  /\  / (_) | |  | | | | | |
// \/    \/_|_| |_|_| \_____/\___/|___/___/ (_)   \/  \/ \___/|_|  |_| |_| |_|

let WORM_PARTS = []
let WORM_TARGET = 4;
let WORM_OLDTARGET = WORM_TARGET;
let WORM_ANGLE;
let WORM_DEAD = false;

class NAV_POINT_WORM
{
    id;
    name;
    origin;
    parents;
    state;
    constructor(id, name, origin)
    {
        this.id = id;
        this.name = name;
        this.origin = origin;
        this.parents = [];
        this.state = true;
    }
    SetParent(id)
    {
        this.parents.push(id)
    }
    StateBool()
    {
        this.state != this.state
    }
}

let NAV_POINT_LIST = [];

Instance.OnScriptInput("WormInit", () => {
    WORM_PARTS = []
    let WORM_MAIN = Instance.FindEntityByName("Worm_Train_Face")
    WORM_PARTS.push(WORM_MAIN)

    NAV_POINT_LIST = []
    for(let i = 0; i < 17; i++)
    {
        let id = i + 1
        let name = `Map_Boss_Worm_Track_${id}`
        let nav = Instance.FindEntityByName(name)
        let origin = nav?.GetAbsOrigin()
        let NAV_POINT = new NAV_POINT_WORM(id, name, origin);
        NAV_POINT_LIST.push(NAV_POINT)
    }
    for(let i = 0; i < NAV_POINT_LIST.length; i++)
    {
        Instance.Msg(`NAME: ${NAV_POINT_LIST[i].name} || ORIGIN: ${NAV_POINT_LIST[i].origin.x} ${NAV_POINT_LIST[i].origin.y} ${NAV_POINT_LIST[i].origin.z}`)
    }
    for(let i = 0; i < NAV_POINT_LIST.length; i++)
    {
        for(let j = 0; j < NAV_POINT_LIST.length; j++)
        {
            if(i != j)
            {
                if(!NAVMESH_NavPointHasParent(i, j))
                {
                    let ent_origin = NAV_POINT_LIST[i].origin
                    let ent2_origin = NAV_POINT_LIST[j].origin
                    let target_Angles = Vector3Utils.lookAt(ent_origin, ent2_origin);
                    target_Angles.roll = 0
                    target_Angles.pitch = 0
                    Instance.Msg(target_Angles)
                    if(target_Angles.yaw % 45 != 0)
                    {
                        continue;
                    }
                    let trace_result = Instance.TraceLine({
                        start: ent_origin,
                        end: ent2_origin
                    })

                    if(trace_result.didHit &&
                    trace_result.hitEntity != undefined &&
                    trace_result.hitEntity.GetClassName() == "worldent")
                    {
                        continue;
                    }
                    NAV_POINT_LIST[i].parents.push(j)
                    NAV_POINT_LIST[j].parents.push(i)
                }
            }
        }
    }
    for(let i = 0; i < NAV_POINT_LIST.length; i++)
    {
        let aDir = []
        
        for (let j = 0; j < NAV_POINT_LIST[i].parents.length; j++)
        {
            let me_Origin = NAV_POINT_LIST[i].origin;
            let target_Origin = NAV_POINT_LIST[i].parents[j].origin
            let dir = Vector3Utils.lookAt(me_Origin, target_Origin);
            
            let bFind = false;
            for (let k = 0; k < aDir.length; k++)
            {
                if (aDir[k][0] == dir.yaw)
                {
                    bFind = true;
                    break;
                }
            }

            if (!bFind)
            {
                aDir.push([dir.yaw, NAV_POINT_LIST[i].parents[j]]);
            }
        }

        // Продумать проверку
        for (let k = 0; k < aDir.length; k++)
        {

        }
    }

    for(let i = 0; i < NAV_POINT_LIST.length; i++)
    {
        for (let j = 0; j < NAV_POINT_LIST[i].parents.length; j++)
        {
            Instance.DebugSphere({center: NAV_POINT_LIST[i].origin, radius: 15, duration: 15, color: {r: 38, g: 255, b: 0}})
            Instance.DebugLine({start: NAV_POINT_LIST[i].origin, end: NAV_POINT_LIST[NAV_POINT_LIST[i].parents[j]].origin, duration: 15, color: {r: 255, g: 0, b: 0}});
        }
    }

    const startID = NAVMESH_GetNearestNavPoint({x: 12556, y: 81.851509, z: -15223});
    WORM_PARTS[0]?.Teleport({position: NAV_POINT_LIST[startID].origin})
})

Instance.OnScriptInput("DebugWorm_00", () => {
    Instance.Msg(`${WORM_PARTS[0]}`)
})

Instance.OnScriptInput("TickMovementWorm", () => {
    if(!WORM_DEAD)
    {
        const WORM_HEAD = WORM_PARTS[0];

		const me_Origin = WORM_HEAD.GetAbsOrigin();
		const me_Angles = WORM_HEAD.GetAbsAngles();

		let target_Origin = NAV_POINT_LIST[WORM_TARGET].origin;
        const target_Distance = Vector3Utils.distance(target_Origin, me_Origin);
        let target_Angles = Vector3Utils.lookAt(me_Origin, target_Origin);
		target_Angles.roll = 0;
		target_Angles.pitch = 0;
        if (target_Distance < 16)
        {
            let iParents = [];
            for (let i = 0; i < NAV_POINT_LIST[WORM_TARGET].parents.length; i++)
            {
                if (NAV_POINT_LIST[WORM_TARGET].parents[i] != WORM_OLDTARGET)
                {
                    iParents.push(NAV_POINT_LIST[WORM_TARGET].parents[i]);
                }
            }

            WORM_OLDTARGET = WORM_TARGET
            if (iParents.length == 1)
            {
                WORM_TARGET = iParents[0];
            }
            else
            {
                WORM_TARGET = iParents[GetRandomNumber(0, iParents.length-1)];
            }
            Instance.Msg(`1 ${target_Angles}`);
            Instance.Msg(`new ${WORM_TARGET}`)
        }

		let Step = 5;
		let qAngles = EulerUtils.rotateTowards(me_Angles, target_Angles, Step)
        
        //Смотрит на цель можно ехать
        if (EulerUtils.equals(qAngles, target_Angles))
        {
            let next_Origin = Vector3Utils.add(me_Origin, (Vector3Utils.scale(EulerUtils.forward(target_Angles), 4.0)))
            WORM_HEAD.Teleport({position: next_Origin, angles: qAngles}) 
        }
	    else
        {
            WORM_HEAD.Teleport({angles: qAngles})
        }
        Instance.EntFireAtName({ name: "Map_Script_Main", input: "RunScriptInput", value: "TickMovementWorm", delay: 0.01 })
    }
})

//    ___                 _   _                 
//   / __\   _ _ __   ___| |_(_) ___  _ __  ___ 
//  / _\| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
// / /  | |_| | | | | (__| |_| | (_) | | | \__ \
// \/    \__,_|_| |_|\___|\__|_|\___/|_| |_|___/

function GetRandomNumber(min, max ) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
        if (random < items[i].weight) {
            return items[i].value;
        }
        random -= items[i].weight;
    }
}

function IsValidPlayerTeam(player, team)
{
    return player != null && player?.IsValid() && player?.IsAlive() && player?.GetTeamNumber() == team
}

function GetValidPlayersCT() 
{
    return Instance.FindEntitiesByClass("player").filter(p => IsValidPlayerTeam(p, 3));
}

function NAVMESH_NavPointHasParent(ID_00, ID_01)
{
	for (let i = 0; i < NAV_POINT_LIST[ID_00].parents.length; i++)
	{
		if (NAV_POINT_LIST[ID_00].parents[i] == ID_01)
		{
			return true;
		}
	}

	return false;
}

function NAVMESH_GetNearestNavPoint(vecOrigin)
{
	let ID = -1;
	let iMin = 99999;
	for (let i = 0; i < NAV_POINT_LIST.length; i++)
	{
		if (Vector3Utils.distance(vecOrigin, NAV_POINT_LIST[i].origin) > 128)
		{
			continue;
		}

		const iDistance = Vector3Utils.distance(vecOrigin, NAV_POINT_LIST[i].origin);

		if (iDistance < iMin)
		{
			iMin = iDistance;
			ID = i;
		}
	}

	return ID;
}

function Delay(callback, delaySeconds) {
    DelayedCalls.push({
        time: Instance.GetGameTime() + delaySeconds,
        callback: callback
    });
}

//    __                _       
//   /__\ ___  ___  ___| |_ ___ 
//  / \/// _ \/ __|/ _ \ __/ __|
// / _  \  __/\__ \  __/ |_\__ \
// \/ \_/\___||___/\___|\__|___/

function ResetFloor()
{
    players_in_elevator = 0;
    climate_fire = false;
    climate_freeze = false;
}

function ResetVariables()
{
    if(!isVoteExtremeSucceeded)
    {
        pre_human_hp = 100;
        pre_human_max_hp = 170;
        pre_traps_percentage = 30;
        pre_npcs_percentage = 20;
        pre_isExitGlow = true;
        pre_isLightningStrikes = true;
        pre_isFallDamage = false;
        pre_isFakeExits = false;
        pre_isDeadEndChunks = false;
        pre_isVipMode = false;
        pre_floors_max = 6;
        FAKE_EXIT_CHANCE[0].weight = 90;
        FAKE_EXIT_CHANCE[1].weight = 10;
        CLIMATE_FLOOR_CHANCE[0].weight = 80;
        CLIMATE_FLOOR_CHANCE[1].weight = 10;
        CLIMATE_FLOOR_CHANCE[2].weight = 10;
    }
    if(isVoteExtremeSucceeded)
    {
        pre_human_hp = 100;
        pre_human_max_hp = 130;
        pre_traps_percentage = 80;
        pre_npcs_percentage = 50;
        pre_isExitGlow = false;
        pre_isLightningStrikes = true;
        pre_isFallDamage = false;
        pre_isFakeExits = true;
        pre_isDeadEndChunks = true;
        pre_isVipMode = false;
        pre_floors_max = 7;
        FAKE_EXIT_CHANCE[0].weight = 0;
        FAKE_EXIT_CHANCE[1].weight = 100;
        CLIMATE_FLOOR_CHANCE[0].weight = 50;
        CLIMATE_FLOOR_CHANCE[1].weight = 20;
        CLIMATE_FLOOR_CHANCE[2].weight = 30;
    }
    ResetAdminWorldText();
}

function ResetScript()
{
    total_traps_spawned = 0;
    total_traps_activated = 0;
    total_traps_broken = 0;
    total_heals_used = 0;
    total_bottles_found = 0;

    isVipDead = false;
    VIP_PLAYER = null;
    
    players_in_elevator = 0;
    climate_fire = false;
    climate_freeze = false;
    meat = 0;
    meat_max = 0;
    floor = 0;
    floors_min = 1;
    safezone_timer = 23;

    UpdateVariables();

    ResetAdminWorldText();
}

function UpdateVariables()
{
    human_hp = pre_human_hp;
    human_max_hp = pre_human_max_hp;
    traps_percentage = pre_traps_percentage;
    npcs_percentage = pre_npcs_percentage;
    isExitGlow = pre_isExitGlow;
    isLightningStrikes = pre_isLightningStrikes;
    isFallDamage = pre_isFallDamage;
    isFakeExits = pre_isFakeExits;
    isDeadEndChunks = pre_isDeadEndChunks;
    isVipMode = pre_isVipMode;
    floors_max = pre_floors_max;
    meat_max = Math.floor((floors_max * 0.8) * 2)
    if(isFallDamage)
    {
        Instance.ServerCommand("sv_falldamage_scale 0.4")
    }
    if(!isFallDamage)
    {
        Instance.ServerCommand("sv_falldamage_scale 0")
    }
}

function ResetAdminWorldText()
{
    Instance.EntFireAtName({ name: "Admin_HP_Value", input: "SetMessage", value: human_hp, delay: 0.00 })
    Instance.EntFireAtName({ name: "Admin_MaxHP_Value", input: "SetMessage", value: human_max_hp, delay: 0.00 })
    Instance.EntFireAtName({ name: "Admin_Traps_Value", input: "SetMessage", value: traps_percentage + "%", delay: 0.00 })
    Instance.EntFireAtName({ name: "Admin_NPCs_Value", input: "SetMessage", value: npcs_percentage + "%", delay: 0.00 })
    if(isExitGlow)
    {
        Instance.EntFireAtName({ name: "Admin_ExitGlow_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })
    }
    if(!isExitGlow)
    {
        Instance.EntFireAtName({ name: "Admin_ExitGlow_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
    if(isLightningStrikes)
    {
        Instance.EntFireAtName({ name: "Admin_LightningStrikes_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })
    }
    if(!isLightningStrikes)
    {
        Instance.EntFireAtName({ name: "Admin_LightningStrikes_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
    if(isFallDamage)
    {
        Instance.EntFireAtName({ name: "Admin_FallDamage_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })
    }
    if(!isFallDamage)
    {
        Instance.EntFireAtName({ name: "Admin_FallDamage_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
    if(isFakeExits)
    {
        Instance.EntFireAtName({ name: "Admin_FakeExits_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })
    }
    if(!isFakeExits)
    {
        Instance.EntFireAtName({ name: "Admin_FakeExits_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
    if(isDeadEndChunks)
    {
        Instance.EntFireAtName({ name: "Admin_DeadEndChunks_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })
    }
    if(!isDeadEndChunks)
    {
        Instance.EntFireAtName({ name: "Admin_DeadEndChunks_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
    if(isVipMode)
    {
        Instance.EntFireAtName({ name: "Admin_VipMode_Bool", input: "SetMessage", value: "ENABLED", delay: 0.00 })
    }
    if(!isVipMode)
    {
        Instance.EntFireAtName({ name: "Admin_VipMode_Bool", input: "SetMessage", value: "DISABLED", delay: 0.00 })
    }
    Instance.EntFireAtName({ name: "Admin_MaxFloors_Value", input: "SetMessage", value: floors_max - 1, delay: 0.00 })
}