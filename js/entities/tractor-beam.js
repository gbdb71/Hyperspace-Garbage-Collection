/*globals define*/
define([
  'entities/physics-entity',
  'geometry/rect'
], function( PhysicsEntity, Rect ) {
  'use strict';

  function TractorBeam( x, y, width ) {
    PhysicsEntity.call( this, x, y );

    // Width of the tractor beam effect.
    this.width = width || 0;
    // Distance to which tractor beam affects other physics entities.
    this.distance = 0;
    // Strength of the tractor beam.
    this.force = 0;

    this.initialize();
  }

  TractorBeam.prototype = new PhysicsEntity();
  TractorBeam.prototype.constructor = TractorBeam;

  TractorBeam.prototype.initialize = function() {
    var rect = new Rect( 0, 0, 10, this.width );

    rect.fill.set({
      red: 255,
      alpha: 1.0
    });

    rect.stroke.alpha = 1.0;
    rect.lineWidth = 3;

    this.shapes.push( rect );
  };

  TractorBeam.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );

    ctx.save();

    ctx.translate( this.x, this.y );
    ctx.rotate( -this.rotation );

    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.fillRect( 0, -0.5 * this.width, this.distance, this.width );

    ctx.restore();
  };

  TractorBeam.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( !this.world ) {
      return;
    }

    var cos = Math.cos( -this.rotation ),
        sin = Math.sin( -this.rotation );

    var halfWidth = 0.5 * this.width;

    this.world.entities.forEach(function( entity ) {
      if ( !( entity instanceof PhysicsEntity ) ||
          entity.fixed ||
          entity === this ) {
        return;
      }

      var x = entity.x - this.x,
          y = entity.y - this.y;

      var rx, ry;
      if ( this.rotation ) {
        rx =  cos * x + sin * y;
        ry = -sin * x + cos * y;

        x = rx;
        y = ry;
      }

      if ( -halfWidth <= y && y <= halfWidth &&
            0 <= x && x <= this.distance ) {
        entity.force( cos * this.force, sin * this.force );
      }

    }.bind( this ));
  };

  return TractorBeam;
});