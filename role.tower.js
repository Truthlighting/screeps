/**
 * Created by truthlighting on 9/19/2016.
 */
var roleTower = {
    run: function() {
        var towers = [Game.getObjectById('57e09e99e14d5451484ad4b8'), Game.getObjectById('57db653e0f3c649e5b7c3cfe')];
        if (towers.length > 0) {
            for (i=0; i < towers.length; i++) {

                var closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var closestDamagedStructure = towers[i].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < structure.hitsMax
                })
                if (closestHostile) {
                    towers[i].attack(closestHostile);
                }

                if (closestDamagedStructure) {
                    towers[i].repair(closestDamagedStructure);
                }
            }
        }
    }
};

module.exports = roleTower;