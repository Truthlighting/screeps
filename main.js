/**
 * Created by truthlighting on 9/14/2016.
 */
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
if (!Memory.hCreepID) {
    Memory.hCreepID = 1;
}
if (!Memory.bCreepID) {
    Memory.bCreepID = 1;
}
if (!Memory.uCreepID) {
    Memory.uCreepID = 1;
}

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
//    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 4 && Game.spawns['Harmony'].canCreateCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "H-" + Memory.hCreepID)==OK) {
        var newName = Game.spawns['Harmony'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "H-" + Memory.hCreepID, {role: 'harvester'});
        Memory.hCreepID++;
        console.log('Spawning new harvester: ' + newName);
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
//    console.log('Upgraders: ' + harvesters.length);

    if(upgraders.length < 4 && harvesters.length >= 4 && Game.spawns['Harmony'].canCreateCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "U-" + Memory.uCreepID)==OK) {
        var newName = Game.spawns['Harmony'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "U-" + Memory.uCreepID, {role: 'upgrader'});
        Memory.uCreepID++;
        console.log('Spawning new upgrader: ' + newName);
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
//    console.log('Upgraders: ' + harvesters.length);

    if(builders.length < 2 && harvesters.length >= 4 && Game.spawns['Harmony'].canCreateCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "B-" + Memory.bCreepID)==OK) {
        var newName = Game.spawns['Harmony'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], "B-" + Memory.bCreepID, {role: 'builder'});
        Memory.bCreepID++;
        console.log('Spawning new builder: ' + newName);
    }

    for(var creepName in Game.creeps) {
        var creep = Game.creeps[creepName];
        if(creep.memory.role == 'harvester' || creep == 'H-1') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

};