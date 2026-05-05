import { MODULE_ID } from "./helper/const.js";
import { getCanvasActors } from "./lib/helpers.js";
import {
  cooldownCache,
  getCoolDownTime,
  updateFrequencyOfActors,
} from "./module.js";
import { showCooldownsOnSheet } from "./styling.js";

/**
 * Updates an item's cooldown flag based on frequency changes.
 *
 * @param {Object} item - The item to be updated.
 * @param {Object} changes - The changes being applied to the item.
 * @param {*} _diff - Unused parameter (possibly for future use).
 * @param {*} _userID - Unused parameter (possibly for future use).
 */
export async function updateItem(item, changes, _diff, _userID) {
  const usesChange = changes?.system?.frequency?.value;
  const maxUses = item?.system?.frequency?.max;
  if (!maxUses) return;

  // If uses are less than max, update or set cooldown flag
  if (usesChange < maxUses) {
    updateCooldownFlag(item);
  } else if (usesChange && usesChange >= maxUses) {
    // If uses are at or above max, remove cooldown flag
    item.unsetFlag(MODULE_ID, "cooldown");
    cooldownCache.delete(item.uuid);
  }
}

/**
 * Updates the cooldown flag for an item.
 *
 * @param {Object} item - The item to update the cooldown flag for.
 */
function updateCooldownFlag(item) {
  const frequencyPer = item?.system?.frequency?.per;
  const currentFlag =
    cooldownCache.get(item.uuid) || item.getFlag(MODULE_ID, "cooldown");

  const shouldUpdateFlag =
    !currentFlag ||
    currentFlag.per !== frequencyPer ||
    (currentFlag.hasOwnProperty("cooldown") && !currentFlag?.cooldown) ||
    !currentFlag.hasOwnProperty("version");

  if (shouldUpdateFlag) {
    const cooldown = getCoolDownTime(
      item?.system?.frequency,
      item?.system?.slug,
    );
    if (cooldown) {
      const newFlag = {
        cooldown,
        per: frequencyPer,
        version: game.modules?.get(MODULE_ID)?.version,
      };
      item.setFlag(MODULE_ID, "cooldown", newFlag);
      cooldownCache.set(item.uuid, newFlag);
    }
  }
}

/**
 * Updates the world time and refreshes frequency-based abilities for actors.
 *
 * @param {number} total - The total amount of time passed.
 * @param {number} diff - The difference in time since the last update.
 */
export async function updateWorldTime(total, diff) {
  if (!game.user.isGM) return;

  // Include canvas tokens if the setting is enabled
  const actors = game.settings.get(MODULE_ID, "include-canvas.enabled")
    ? [...game.actors.party.members, ...getCanvasActors()]
    : game.actors.party.members;

  // Determine the update type based on combat status
  const updateType = game.combat ? "default" : "updateTime";
  // Update frequency-based abilities for all relevant actors
  await updateFrequencyOfActors(actors, total, diff, updateType);
}

export async function combatRound(encounter, _changes, _diff, _userID) {
  const actors = encounter.combatants.contents.map(
    (combatant) => combatant.token.actor,
  );
  await updateFrequencyOfActors(actors, 0, _diff, "endRound");
}

Hooks.on("renderCharacterSheetPF2e", (_sheet, html, character) => {
  if (
    game.settings.get(MODULE_ID, "inventory.icon.enabled") &&
    !(game.settings.get(MODULE_ID, "inventory.icon.gm-only") && !game.user.isGM)
  ) {
    const a = _sheet.actor;
    if (character.owner) {
      const actionsList = html.find(
        ".sheet-body .actions-container .actions-panels",
      );

      showCooldownsOnSheet(actionsList, a);
    }
  }
});
