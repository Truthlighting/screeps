/**
 * Created by truthlighting on 9/19/2016.
 */
var roleTower = {
    run: function() {
        var towers = Game.getObjectById('TOWER_ID');
        if (towers) {
            var closestHostile = towers.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var closestDamagedStructure = towers.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
            });

            if (closestHostile) {
                towers.attack(closestHostile);
            }

            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
};

module.exports = roleTower;