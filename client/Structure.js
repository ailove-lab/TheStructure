// Generated by CoffeeScript 1.6.2
var Atman, Bot, Construction, Manager, SBot, SConstruction, Structure, TBot, TConstruction, Task, device, _ref, _ref1, _ref2, _ref3, _ref4,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Atman = (function() {
  function Atman() {}

  return Atman;

})();

Structure = (function() {
  function Structure() {}

  Atman;

  construction;

  manager;

  bots;

  massCenter;

  mass;

  momentum;

  return Structure;

})();

Construction = (function() {
  function Construction() {}

  parent;

  children;

  level;

  structure;

  return Construction;

})();

device = (function(_super) {
  __extends(device, _super);

  function device() {
    _ref = device.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return device;

})(Construction);

Manager = (function() {
  function Manager() {}

  Manager.prototype.tasks = [];

  return Manager;

})();

Task = (function() {
  function Task() {}

  return Task;

})();

TConstruction = (function(_super) {
  __extends(TConstruction, _super);

  function TConstruction() {
    _ref1 = TConstruction.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  return TConstruction;

})(Construction);

SConstruction = (function(_super) {
  __extends(SConstruction, _super);

  function SConstruction() {
    _ref2 = SConstruction.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  return SConstruction;

})(Construction);

Bot = (function() {
  function Bot() {}

  structure;

  currentTask;

  return Bot;

})();

TBot = (function(_super) {
  __extends(TBot, _super);

  function TBot() {
    _ref3 = TBot.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  return TBot;

})(Bot);

SBot = (function(_super) {
  __extends(SBot, _super);

  function SBot() {
    _ref4 = SBot.__super__.constructor.apply(this, arguments);
    return _ref4;
  }

  return SBot;

})(Bot);
