/*
parseRepeatName takes a string name of a repeating attribute (e.g. repeating_inventory_-mjesdf09-32Z_weight). It then returns the section name (repeating_inventory), the row's ID (-mjesdf09-32Z), and the name of the field itself (weight). An example of how to call it is included immediately after it. This makes it easy to figure out what action needs to be taken and/or which section and row in that section needs to be worked on. If passed a regular attribute name (e.g. strength), it simply returns the attribute name.
*/
const parseRepeatName = function(string){
  let match = string.match(/(?:(repeating_[^_]+)_([^_]+)_)?(.+)/);
  match.shift();
  return match;
};
let [section,rowID,field] = parseRepeatName('repeating_inventory_-mjesdf09-32Z_weight');
/*
section => repeating_inventory
rowID => -mjesdf09-32Z
field => weight
*/