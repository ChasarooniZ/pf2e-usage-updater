import { DAY, HOUR, MINUTE, MODULE_ID, MONTH, WEEK, YEAR } from "./helper/const.js";
import { combatRound, updateItem, updateWorldTime } from "./hooks.js";

export const cooldownCache = new Map();

Hooks.once("ready", function () {
  console.log("PF2E Uses Updater is Active");
  if (!game.user.isGM) return;
  //Check if item frequency is updated
  Hooks.on("updateItem", updateItem);

  //Refreshing item usage count
  Hooks.on("updateWorldTime", updateWorldTime);

  //Hooks.on("combatRound", combatRound);
});

/**
 * Updates the frequency of items for multiple actors.
 * @param {Array} party - The array of actors to update.
 * @param {number} total - The total time elapsed.
 * @param {number} diff - The time difference.
 * @param {string} [situation="default"] - The situation context.
 * @returns {Promise<void>}
 */
export async function updateFrequencyOfActors(party, total, diff, situation = "default") {
  const updates = [];
  const specialCaseUpdates = [];

  for (const character of party) {
    const { itemUpdates } = await processCharacterItems(character, total, diff, situation);
    updates.push(...itemUpdates);
    //specialCaseUpdates.push(...specialCases);
  }

  if (updates.length > 0) {
    await Item.updateDocuments(updates);
  }

  // Handle special cases asynchronously
  //specialCaseUpdates.forEach(update => update());
}

/**
 * Updates the frequency of items for a single actor.
 * @param {Object} character - The actor to update.
 * @param {number} total - The total time elapsed.
 * @param {number} diff - The time difference.
 * @param {string} [situation="default"] - The situation context.
 * @returns {Promise<void>}
 */
export async function updateFrequency(character, total, diff, situation = "default") {
  const items = character.items.contents;
  const relevantItems = items.filter((it) =>
    ['action', 'equipment'].includes(it.type) && isItemRelevant(it, total, diff, situation)
  );
  relevantItems.forEach((it) => {
    it.unsetFlag(MODULE_ID, "cooldown");
  });
  if (relevantItems.length > 0) {
    await character.updateEmbeddedDocuments(
      "Item",
      relevantItems.map((it) => ({
        _id: it.id,
        system: { frequency: { value: it?.system?.frequency?.max ?? 1 } },
      }))
    );
  }
}

async function processCharacterItems(character, total, diff, situation) {
  const itemUpdates = [];
  const specialCases = [];
  const relevantItems = character.items.contents.filter(it => checkSpecialCases(it) || isItemRelevant(it, total, diff, situation));

  for (const item of relevantItems) {
    if (checkSpecialCases(item)) {
      //specialCases.push(() => handleSpecialCase(item, total, diff, situation));
      specialCases.push(item)
      await handleSpecialCase(item, total, diff, situation)
    } else {

      item.unsetFlag(MODULE_ID, "cooldown");
      itemUpdates.push({
        _id: item.id,
        "system.frequency.value": item.system.frequency?.max ?? 1
      });


    }
  }

  return { itemUpdates, specialCases };
}

/**
 * Checks if an item is relevant for updating based on cooldown and situation.
 * @param {Object} item - The item to check.
 * @param {number} total - The total time elapsed.
 * @param {number} diff - The time difference.
 * @param {string} situation - The situation context.
 * @returns {Promise<boolean>}
 */
function isItemRelevant(item, total, diff, situation) {
  if (!cooldownCache.has(item.uuid)) {
    const cooldown = item.getFlag(MODULE_ID, "cooldown")?.cooldown;
    cooldownCache.set(item.uuid, cooldown);
  }

  const cooldown = cooldownCache.get(item.uuid);
  if (!cooldown) return false;

  const frequency = item.system.frequency;
  if (!frequency || frequency.value >= frequency.max) return false;

  switch (situation) {
    case "updateTime":
      return cooldown <= total || ["turn", "round"].includes(cooldown);
    case "endRound":
      return false; // TODO: Implement logic for handling longer cooldowns in combat
    default:
      return cooldown <= total;
  }
}

/**
 * Calculates the cooldown time for a given frequency.
 * @param {Object} frequency - The frequency object.
 * @returns {string|number} The cooldown time or a string representing a special case.
 */
export function getCoolDownTime(frequency) {
  const currentTime = game.time.worldTime;
  switch (frequency.per) {
    case "turn":
      return "turn";//Note this is handled by the system (in combat)
    case "round":
      return "round";//Note this is handled by the system (in combat)
    case "PT1M": // per 1 Minute
      return currentTime + MINUTE;
    case "PT10M": // per 10 Minutes
      return currentTime + (10 * MINUTE);
    case "PT1H": // per 1 hour
      return currentTime + HOUR;
    case "PT24H": // per 24 hours
      return currentTime + DAY;
    case "day": // per Day
      return "day"; //Note this is handled by the system
    case "PT1W": // per 1 Week
      return currentTime + WEEK;
    case "PT1M": // per 1 Month
      return currentTime + MONTH;
    case "PT1Y": // per 1 Year
      return currentTime + YEAR;
  }
}

/**
 * Retrieves the actors in the current combat.
 * @returns {Array} An array of actors in the combat.
 */
export function getCombatActor() {
  game.combat.combatants.contents.map((com) => com.token.actor);
}

/**
 * Checks and handles special cases for specific items.
 * @param {Object} item - The item to check.
 * @param {number} _total - The total time elapsed (unused).
 * @param {number} diff - The time difference.
 * @param {string} _situation - The situation context (unused).
 * @returns {Promise<boolean>}
 */
export async function handleSpecialCase(item, _total, diff, _situation) {
  const slug = item.system.slug;
  const actor = item.actor;
  switch (slug) {
    case "aeon-stone-pearly-white-spindle":
      const mode = game.settings.get(MODULE_ID, "automate-item.aeon-pearly-white");
      if (mode !== 'disabled') {
        if (item.system.usage.value !== "worn") {
          break;
        }
        const health = Math.min(
          Math.floor(diff / 60),
          actor.system.attributes.hp.max - actor.system.attributes.hp.value
        );
        if (health > 0) {
          if (mode === 'roll') {
            const DamageRoll = CONFIG.Dice.rolls.find(
              (r) => r.name === "DamageRoll"
            );
            new DamageRoll(`{${health}}[Healing]`).toMessage({
              flavor: item.name,
              speaker: ChatMessage.getSpeaker({ actor }),
            });
          } else if (mode === 'auto') {
            await actor.update({ "system.attributes.hp.value": health + actor.system.attributes.hp.value })
            await ChatMessage.create({ content: `@UUID[Compendium.pf2e.equipment-srd.Item.4A8SFipG78SMWQEU] healed <b>${actor.name}</b> for ${health}` });
          }
        }
      }
      break;
    default:
      break;
  }
  return false;
}

export function checkSpecialCases(item) {
  return ['aeon-stone-pearly-white-spindle'].includes(item.slug);
}
