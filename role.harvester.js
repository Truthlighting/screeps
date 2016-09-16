/**
 * Created by truthlighting on 9/14/2016.
 */
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transporting && creep.carry.energy == 0) {
            creep.memory.transporting = false;
            creep.say("Harvesting");
        }
        if (!creep.memory.transporting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transporting = true;
            creep.say("Xporting");
        }

        if(!creep.memory.transporting) {

            //var sources = creep.room.find(FIND_SOURCES);
            var target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); /*, {
                filter: (source) => { source.energy > 0 }
            })*/
            //creep.say("H-"+target);
            //creep.say("H - " + target.energy);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                //if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                //    creep.moveTo(sources[0]);
            }

        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
            })

            if(targets.length > 0) {
                var target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

            } else {
                var roadsToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object){
                        return (object.structureType == STRUCTURE_ROAD ||
                        object.structureType == STRUCTURE_CONTAINER ) && (object.hits < object.hitsMax);
                    }
                });

                if (roadsToRepair){
                    //creep.say("Mvg to Rpr");
                    var targetRoad = creep.pos.findClosestByPath(roadsToRepair);
                    if (creep.repair(targetRoad) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetRoad);
                        creep.say("Mvg to Repair");
                    }


                    // perhaps check the results again?

                } else {
                    // nothing to repair
                    creep.moveTo(Game.flags.Flag1);
                }
            }
        }
    }
};

module.exports = roleHarvester;