/**
 * Created by truthlighting on 9/14/2016.
 */
var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
module.exports = roleHauler;