import { MODULE_ID } from "./const.js";

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
      handlePearlyWhiteSpindle(actor, item);
      break;
    default:
      break;
  }
  return false;
}

async function handlePearlyWhiteSpindle(actor, item) {
  const mode = game.settings.get(MODULE_ID, "automate-item.aeon-pearly-white");
  if (mode !== "disabled") {
    if (item.system.usage.value !== "worn") {
      return;
    }
    const health = Math.min(
      Math.floor(diff / 60),
      actor.system.attributes.hp.max - actor.system.attributes.hp.value
    );
    if (health > 0) {
      if (mode === "roll") {
        const DamageRoll = CONFIG.Dice.rolls.find(
          (r) => r.name === "DamageRoll"
        );
        new DamageRoll(`{${health}}[Healing]`).toMessage({
          flavor: item.name,
          speaker: ChatMessage.getSpeaker({ actor }),
        });
      } else if (mode === "auto") {
        await actor.update({
          "system.attributes.hp.value":
            health + actor.system.attributes.hp.value,
        });
        await ChatMessage.create({
          content: `${item.link} healed <b>${actor.name}</b> for ${health}`,
        });
      }
    }
  }
}
