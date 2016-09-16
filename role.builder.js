/**
 * Created by truthlighting on 9/14/2016.
 */
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var activeSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        //console.log(activeSource);
        if ((creep.memory.building && creep.carry.energy == 0 && activeSource !== null) || (creep.memory.idling && activeSource !== null)) {
            creep.memory.building = false;
            creep.memory.idling = false;
            creep.say('harvesting');
        } else if (!creep.memory.building && (creep.carry.energy == creep.carryCapacity || ((activeSource === null) && creep.carry.energy > 0))) {
            creep.memory.building = true;
            creep.memory.idling = false;
            creep.say('building');
        } else if (activeSource === null) {
            creep.memory.idling = true;
            creep.say('B-idling');
        }

        if (creep.memory.building) {
            //creep.say("wyd");
            if (creep.room.find(FIND_CONSTRUCTION_SITES) !== []) {
                creep.say("wyd");
                var targetToBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (creep.build(targetToBuild) == ERR_NOT_IN_RANGE) {
                    creep.say("mvgtobld");
                    creep.moveTo(targetToBuild);
                }
            } else {
                creep.say("wyd2");
                var wallsToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL &&
                    (structure.hits < 80000) &&
                    (structure.hits > 0));
                    }
                })
                //creep.say("wyd3");
                if (creep.room.find(wallsToRepair) !== []) {
                    var wallToRepair = creep.pos.findClosestByPath(wallsToRepair);
                    if (creep.repair(wallToRepair) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(wallToRepair);
                        creep.say("Repair wall");
                    }
                }
            }
        }


        else if (!creep.memory.idling) {
            //var target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (activeSource !== null) {
                if(creep.harvest(activeSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(activeSource);
                }
            } else {
                //do something else
            }

        } else {
            var targetFlag = creep.pos.findClosestByPath([Game.flags.Flag1,Game.flags.Flag2]);
            creep.moveTo(targetFlag);
        }
    }
};

module.exports = roleBuilder;