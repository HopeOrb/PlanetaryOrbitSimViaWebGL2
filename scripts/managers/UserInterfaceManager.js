import GUI from "lil-gui";
import { Planet } from "../classes/Planet";
import { Star } from "../classes/Star";

export class UserInterfaceManager {
    
    gui;
    
    objectFolder;
    spotlightFolder;
    trailsFolder;

    initialValues = {};

    constructor() {
        this.gui = new GUI();
    }

    initSpotlightInterface( spotlight ) {
        this.spotlightFolder = this.gui.addFolder( 'Spotlight' );
        
        this.spotlightFolder.add( spotlight, 'intensity', 0, 50 ).name( 'Intensity' );
        this.spotlightFolder.add( spotlight, 'angle', 0, (Math.PI / 2) ).name( 'Cone Angle' );
        this.spotlightFolder.add( spotlight, 'penumbra', 0, 1 ).name( 'Penumbra' );
    }

    initTrailInterface( scene ) {
        this.trailsFolder = this.gui.addFolder( 'Trails' );

        this.trailsFolder.add( {reset: () => this.resetTrails( scene )}, 'reset' ).name( 'Reset Trails' );
    }
    
    resetTrails( scene ) {
        scene.traverse( (obj) => {
            if (obj instanceof Planet) {
                obj.resetTrail();
            }
        } )
    }

    addObjectInterface( obj ) {
        if ( this.objectFolder ) this.removeObjectInterface();

        this.initialValues[obj.uuid] = {
            position: { ...obj.position.clone() },
            rotation: { ...obj.rotation.clone() },
            scale: { ...obj.scale.clone() },
            velocity: { ...obj.velocity },
            mass: { ...obj.mass }
        };

        this.objectFolder = this.gui.addFolder( 'Selected Object' );

        let lowerMass, upperMass;

        if (obj instanceof Planet) {                
                this.objectFolder.add( obj.velocity, 'x', -5, 5 ).name('Velocity X').step( 1 );
                this.objectFolder.add( obj.velocity, 'y', -5, 5 ).name('Velocity Y').step( 1 );
                this.objectFolder.add( obj.velocity, 'z', -5, 5 ).name('Velocity Z').step( 1 );
        
                lowerMass = 500;
                upperMass = 2000;
                
        } else if (obj instanceof Star) {
                lowerMass = 300000;
                upperMass = 500000;
        }
            
        this.objectFolder.add( obj, 'mass', lowerMass, upperMass ).name("Mass");

        // TODO: The function messes up something about the positions
        //this.objectFolder.add( { reset: () => this.resetObject( obj ) }, 'reset' ).name( "Reset" );
    }

    removeObjectInterface() {
        this.objectFolder.destroy();
    }

    resetObject( obj ) {
        if ( this.initialValues[obj.uuid] ) {
            const initial = this.initialValues[obj.uuid];

            obj.position.copy(initial.position);
            obj.rotation.copy(initial.rotation);
            obj.scale.copy(initial.scale);
            obj.velocity = initial.velocity;
            obj.mass = initial.mass;
        }
    }
}