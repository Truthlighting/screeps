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
            var target = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                //if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                //    creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
        });
            if(targets.length > 0) {
                var target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                creep.moveTo(Game.flags.flag1);
            }
        }
    }
};

module.exports = roleHarvester;