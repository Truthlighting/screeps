/**
 * Created by truthlighting on 9/14/2016.
 */
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var activeSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        var energyStorageStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_STORAGE) &&
                    (structure.store[RESOURCE_ENERGY] > 0)
                    }
            })

        //console.log(activeSource);
        console.log(energyStorageStructures.length);
        if ((creep.memory.building && creep.carry.energy == 0 && energyStorageStructures.length > 0) || (creep.memory.idling && energyStorageStructures.length > 0)) {
            creep.memory.building = false;
            creep.memory.idling = false;
            creep.say('harvesting');
        } else if (!creep.memory.building && (creep.carry.energy == creep.carryCapacity || ((energyStorageStructures.length == 0) && creep.carry.energy > 0))) {
            creep.memory.building = true;
            creep.memory.idling = false;
            creep.say('building');
        } else if (!creep.memory.idling && energyStorageStructures.length == 0 && creep.carry.energy == 0) {
            creep.memory.idling = true;
            creep.say('B-idling');
        }

        if (creep.memory.building) {
            var buildSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (buildSites.length != 0) {
                var targetToBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (creep.build(targetToBuild) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetToBuild);
                }
            } else {
                var wallsToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL &&
                    (structure.hits < 400000) &&
                    (structure.hits > 0));
                    }
                })
                if (wallsToRepair.length != 0) {
                    var wallToRepair = creep.pos.findClosestByPath(wallsToRepair);
                    if (creep.repair(wallToRepair) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(wallToRepair);
                    }
                }
            }
        }


        else if (!creep.memory.idling) {
            //var target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);



            if(energyStorageStructures.length > 0) {
                var energyStorageStructure = creep.pos.findClosestByPath(energyStorageStructures);
                if(creep.withdraw(energyStorageStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyStorageStructure);
                }

            } else {
                //do something else
            }

        } else {
            creep.say("movingtoflg")
            var targetFlag = creep.pos.findClosestByPath([Game.flags.Flag1,Game.flags.Flag2]);
            creep.moveTo(targetFlag);
        }
    }
};

module.exports = roleBuilder;