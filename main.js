/**
 * Created by truthlighting on 9/14/2016.
 */
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTower = require('role.tower');
var roleHauler = require('role.hauler');

if (!Memory.hCreepID) {
    Memory.hCreepID = 1;
}
if (!Memory.bCreepID) {
    Memory.bCreepID = 1;
}
if (!Memory.uCreepID) {
    Memory.uCreepID = 1;
}
if (!Memory.cCreepID) {
    Memory.cCreepID = 1;
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
    var sources = Game.rooms['W2N48'].find(FIND_SOURCES);
    var harvesterSources = _.map(Game.creeps, 'memory.assignedSource');
    var result;
    for (var i=0, l=sources.length; i < l, i++) {
        if (harvesterSources.indexOf(array[i]) == -1) { result = array[i]; break; }
    }
    console.log(result);

    if(harvesters.length < 2 && Game.spawns['Harmony'].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE], "H-" + Memory.hCreepID)==OK) {
        var newName = Game.spawns['Harmony'].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE], "H-" + Memory.hCreepID, {role: 'harvester'});
        Memory.hCreepID++;
        console.log('Spawning new harvester: ' + newName);
    }

    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');

    if(haulers.length < 1 && Game.spawns['Harmony'].canCreateCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], "C-" + Memory.cCreepID)==OK) {
        var newName = Game.spawns['Harmony'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], "C-" + Memory.cCreepID, {role: 'hauler'});
        Memory.cCreepID++;
        console.log('Spawning new hauler: ' + newName);
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
//    console.log('Upgraders: ' + harvesters.length);

    if(upgraders.length < 4 && harvesters.length >= 2 && Game.spawns['Harmony'].canCreateCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "U-" + Memory.uCreepID)==OK) {
        var newName = Game.spawns['Harmony'].createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "U-" + Memory.uCreepID, {role: 'upgrader' });
        Memory.uCreepID++;
        console.log('Spawning new upgrader: ' + newName);
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
//    console.log('Upgraders: ' + harvesters.length);

    if(builders.length < 3 && harvesters.length >= 2 && Game.spawns['Harmony'].canCreateCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "B-" + Memory.bCreepID)==OK) {
        var newName = Game.spawns['Harmony'].createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "B-" + Memory.bCreepID, {role: 'builder'});
        Memory.bCreepID++;
        console.log('Spawning new builder: ' + newName);
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
    }

    roleTower.run();
};