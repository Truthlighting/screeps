/**
 * Created by truthlighting on 9/14/2016.
 */
var roleHauler = {

    /** @param {Creep} creep **/

    run: function(creep) {

        var notFullNotEmptyContainers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                           _.sum(structure.store) < structure.storeCapacity;
                    }
        })

        var notFullNotEmptyStoragePlaces = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) &&
                        (_.sum(structure.store) < structure.storeCapacity &&
                        _.sum(structure.store > 0));
                    }
        })

        if(creep.memory.transporting && creep.carry.energy == 0) {
            creep.memory.transporting = false;
            creep.say("C-Travelling");
        } else if (!creep.memory.transporting && creep.carry.energy == creep.carryCapacity || ((!creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) && creep.carry.energy > 0)) {
            creep.memory.transporting = true;
            creep.say("C-Xporting");
        } else {
            creep.memory.transporting = false;
            creep.memory.idling = true;
            creep.say("C-Idling")
        }

        if (transporting) {
            if (notFullNotEmptyStoragePlaces.length > 0) {
                var notFullNotEmptyStorage = creep.pos.findClosestByPath(notFullNotEmptyStoragePlaces);
                if (creep.transfer(notFullNotEmptyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(notFullNotEmptyStorage);
                }
            }
        } else if (!idling) {
            if(notFullNotEmptyContainers.length > 0) {
                var notFullNotEmptyContainer = creep.pos.findClosestByPath(notFullNotEmptyContainers);
                if (creep.withdraw(notFullNotEmptyContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(notFullNotEmptyContainer);
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