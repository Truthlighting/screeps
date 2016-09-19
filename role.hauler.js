/**
 * Created by truthlighting on 9/14/2016.
 */
var roleHauler = {

    /** @param {Creep} creep **/

    run: function(creep) {
        var notFullnotEmptyContainers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                    _.sum(structure.store) < structure.storeCapacity;
            }
        })

        var notFullnotEmptyStorage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) &&
                    (_.sum(structure.store) < structure.storeCapacity &&
                    _.sum(structure.store > 0));
            }
        })

        if
    };
module.exports = roleHauler;