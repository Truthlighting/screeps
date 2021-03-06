/**
 * Created by truthlighting on 9/20/2016.
 */
/**
 * This guys does the other half of energy collection. The miner gets it from the source, and the helper does the
 * transportation. We don't want them just going for the nearest source, as that means that if we have more than one
 * miner, all the helpers will only go for the first miner. To counter this, we assign them to a miner the same way
 * we assign a miner to a source
 */

var helper = {
    parts: [
        [MOVE, CARRY],
        [MOVE, CARRY, MOVE, CARRY],
        [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
    ],

    assignMiner: function () {
        var creep = this.creep;

        var miner = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: function (miner) {
                if (miner.memory.role == 'miner' && miner.memory.helpers.length < miner.memory.helpersNeeded)
                    return true;

                return false;
            }
        });

        if (miner == undefined)
            return;

        creep.memory.miner = miner.id;
        miner.memory.helpers.push(creep.id);
    },

    /**
     * @TODO: Make helpers smarter about avoiding miners, instead of just waiting till they're 5 tiles away
     * @TODO: When spawns are at .25, and extensions have >= 200, help builders before filling shit up
     */
    action: function () {
        var creep = this.creep;

        if (creep.memory.courier !== undefined && creep.memory.courier == true) {
            creep.memory.courier = false;
            return;
        }

        //If this helper isn't assigned to a miner, find one and assign him to it. If it is assigned to a miner,
        //then find that miner by his id
        if (creep.memory.miner == undefined)
            this.assignMiner();

        var miner = Game.getObjectById(creep.memory.miner);

        if (miner == null) {
            creep.suicide();
            return;
        }
        //console.log("i'm here1");
        //If we can still pick up energy, let's do that
        //console.log("miner: " + miner);
        //console.log("creep:" + creep);
        //console.log("creep.carry: (" + _.sum(creep.carry) + ") < creep.carryCapacity (" + creep.carryCapacity + ")");
        //console.log(_.sum(creep.carry) < creep.carryCapacity);
        if (_.sum(creep.carry) < creep.carryCapacity) {
            //console.log("i'm here");
            if (creep.pos.isNearTo(miner)) {
                var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0];
                //console.log("energy: " + energy);
                creep.pickup(energy);
            }
            else {
                if (miner.memory.isNearSource)
                    creep.moveTo(miner);
            }

            return;
        }

        var target = null;
        //console.log("I'm here");
        //Okay, everything below is for dropping energy off

        if (!target) {
            //console.log("I'm heree");
            //var spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            /*var energyStructures = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) &&
                //            structure.structureType == STRUCTURE_TOWER) &&
                                (structure.energy < structure.energyCapacity);
                            }
            })*/
            //console.log("I'm heree!");
            //console.log(creep.room.findClosestByPath(energyStructures));
            //console.log(_.valuesIn(energyStructures));
            //console.log(creep.room);
            //for (var i in energyStructures) { console.log}
            var energyStructure = {};
            if (!energyStructure) {energyStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (s) => s.energy < s.energyCapacity && s.structureType != STRUCTURE_CONTAINER && s.structureType != STRUCTURE_LINK
            });}
            //console.log(_.valuesIn(energyStructure));
            //var energyStructure = creep.room.findClosestByPath((energyStructures));
            //console.log("energyStructure: " + energyStructure);
            //If we found it, set it as our target
            if (energyStructure)
                target = energyStructure;
        }
        //console.log("I'm here!");
        //console.log(energyStructures);
        //console.log(energyStructure);
        //console.log(target);
        //console.log(" creep.pos.findPathTo: " + creep.pos.findPathTo(target));
        //Let's get the direction we want to go in
        //console.log("i'm here");
        //for (var i in target) {console.log(i)};
        //console.log(creep.pos.findPathTo(target));
        //var targetDirection = creep.pos.findPathTo(target, { ignoreCreeps: true })[0].direction;
        var targetDirection = creep.pos.findPathTo(energyStructure, { ignoreCreeps: true })[0].direction;
        console.log("I'm here 3");
        //Let's look for a courier in that direction. We'll check on making sure they're the right
        //role, if they can hold any energy, if they're in range and if they're in the same direction
        var leftDir = targetDirection - 1;
        var rightDir = targetDirection + 1;

        if (leftDir < 1)
            leftDir += 8;
        if (leftDir > 8)
            leftDir -= 8;

        if (rightDir < 1)
            rightDir += 8;
        if (rightDir > 8)
            rightDir -= 8;
        console.log("I'm here 2");
        var courier = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: function (possibleTarget) {
                return (
                    possibleTarget.memory.role == creep.memory.role
//					&& possibleTarget.memory.miner == creep.memory.miner
                    && _.sum(possibleTarget.carry) < possibleTarget.carryCapacity
                    && creep.pos.inRangeTo(possibleTarget, 1)
                    && (
                        creep.pos.getDirectionTo(possibleTarget) == targetDirection
                        || creep.pos.getDirectionTo(possibleTarget) == leftDir
                        || creep.pos.getDirectionTo(possibleTarget) == rightDir
                    )
                );
            }
        });
        console.log("im here");
        //If we found a courier, make that courier our new target
        if (courier !== null && !creep.pos.isNearTo(target)) {
            target = courier;
            target.memory.courier = true;
        }
        //console.log("target: " + target);
        //If we're near to the target, either give it our energy or drop it
        if (creep.pos.isNearTo(target)) {
            if (_.sum(target.carry) < target.carryCapacity) {
                creep.transfer(target, RESOURCE_ENERGY);
            }
            else
                creep.drop(RESOURCE_ENERGY);
        }
        //Let's do the moving
        else {
            creep.moveTo(target);
        }
    }
};

module.exports = helper;