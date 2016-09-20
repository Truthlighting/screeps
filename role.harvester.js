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
        if (!creep.memory.transporting && creep.carry.energy == creep.carryCapacity || ((!creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) && creep.carry.energy > 0)) {
            creep.memory.transporting = true;
            creep.say("Xporting");
        }

        if(!creep.memory.transporting) {

            //var sources = creep.room.find(FIND_SOURCES);
            if (!creep.memory.assignedSource) {
                var activeSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(activeSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(activeSource);
                }
                /*, {
                 } else {
                 filter: (source) => { source.energy > 0 }
                 })*/
            } else {
                var assignedSource = Game.getObjectById(creep.memory.assignedSource);
                //creep.say("H-"+target);
                //creep.say("H - " + target.energy);
                creep.say("confused");
                if (creep.harvest(assignedSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(assignedSource);
                }
            }

        } else {
            var energyStorageStructures = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                //            structure.structureType == STRUCTURE_TOWER) &&
                            (structure.energy < structure.energyCapacity || _.sum(structure.store) < structure.storeCapacity);
                        }
            })

            if(energyStorageStructures.length > 0) {
                var energyStorageStructure = creep.pos.findClosestByPath(energyStorageStructures);
                if(creep.transfer(energyStorageStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyStorageStructure);
                }

            } else {
                var structuresToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object){
                        return (object.structureType == STRUCTURE_ROAD ||
                        object.structureType == STRUCTURE_CONTAINER ) && (object.hits < object.hitsMax);
                    }
                });

                if (structuresToRepair.length > 0){
                    var structureToRepair = creep.pos.findClosestByPath(structuresToRepair);
                    if (creep.repair(structureToRepair) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureToRepair);
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