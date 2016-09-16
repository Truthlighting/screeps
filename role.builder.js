/**
 * Created by truthlighting on 9/14/2016.
 */
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if (creep.memory.building) {
            if (creep.room.find(FIND_CONSTRUCTION_SITES)) {
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                var repairThem = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL &&
                    (structure.hits < 80000) &&
                    (structure.hits > 0));
                    }
                })

                if (creep.room.find(repairThem)) {
                    var target = creep.pos.findClosestByPath(repairThem);
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        creep.say("Repair wall")
                    }
                }
            }
        }


        else {
            var target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleBuilder;