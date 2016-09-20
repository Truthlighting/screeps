/**
 * Created by truthlighting on 9/14/2016.
 */
var roleHauler = {

    /** @param {Creep} creep **/

    run: function(creep) {

        var energyStorageStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        (structure.energy < structure.energyCapacity);
                    }
        })

        var towers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                        (structure.energy < structure.energyCapacity);
                    }
        })
        if (energyStorageStructures.length == 0) {
            var notEmptyContainers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store[RESOURCE_ENERGY] > 0
            })
        } else {
            var notEmptyContainers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_STORAGE) &&
                                structure.store[RESOURCE_ENERGY] > 0
                    }
            })
        }
        var notFullStoragePlaces = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_STORAGE &&
                                           _.sum(structure.store) < structure.storeCapacity

        })


        if(creep.memory.transporting && creep.carry.energy == 0 || (notEmptyContainers.length > 0 && creep.memory.idling == true)) {
            creep.memory.transporting = false;
            creep.memory.idling = false;
            creep.say("C-Travelling");
        } else if (!creep.memory.transporting && creep.carry.energy == creep.carryCapacity || ((!creep.pos.findClosestByPath(notFullStoragePlaces)) && creep.carry.energy > 0)) {
            creep.memory.transporting = true;
            creep.memory.idling = false;
            creep.say("C-Xporting");
        } else if (notEmptyContainers.length == 0) {
            creep.memory.idling = true;
            creep.say("C-Idling")
        }

        if (creep.memory.transporting) {
            if (energyStorageStructures.length > 0) {
                var energyStorageStructure = creep.pos.findClosestByPath(energyStorageStructures);
                if (creep.transfer(energyStorageStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyStorageStructure);
                }
            } else if (towers.length > 0) {
                var tower = creep.pos.findClosestByPath(towers);
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else if (notFullStoragePlaces.length > 0) {
                var notFullStorage = creep.pos.findClosestByPath(notFullStoragePlaces);
                if (creep.transfer(notFullStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(notFullStorage);
                }
            }
        } else if (!creep.memory.idling) {
            if(notEmptyContainers.length > 0) {
                var notEmptyContainer = creep.pos.findClosestByPath(notEmptyContainers);
                if (creep.withdraw(notEmptyContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(notEmptyContainer);
                }
            }
        } else {
            //idle
            var targetFlag = creep.pos.findClosestByPath([Game.flags.Flag1,Game.flags.Flag2]);
            creep.moveTo(targetFlag);
        }
    }
};

module.exports = roleHauler;