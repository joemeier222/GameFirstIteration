import * as THREE from '../libs/three.module.js';
import { GLTFLoader } from '../libs/GLTFLoader.js';
import { DRACOLoader } from '../libs/DRACOLoader.js';
import { OrbitControls } from '../libs/OrbitControls.js';

class Game{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
		this.clock = new THREE.Clock();

		this.assetsPath = '../assets/';
        
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );
		this.camera.position.set( 1, 1.7, 2.8 );
        
		const texture = new THREE.TextureLoader().load('./assets/background.jpg');
		this.scene = new THREE.Scene();
		this.scene.background = texture;
		
		const ambient = new THREE.AmbientLight('rgb(255, 255, 255)', 1.0);
		this.scene.add(ambient);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        
        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        controls.target.set(0, 1, 0);
		controls.update();
        this.load();
		this.initKeys();
		window.addEventListener('resize', this.resize.bind(this) );
		
        
	}
	
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

    load(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}/`);
		const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '../../libs/draco/' );
        loader.setDRACOLoader( dracoLoader );
		
		loader.load(
			'hero.glb',
			gltf => {

				this.scene.add( gltf.scene );
                this.object = gltf.scene;
				this.mixer = new THREE.AnimationMixer( gltf.scene );

				this.animations = {};

				gltf.animations.forEach( animation => {
					this.animations[animation.name.toLowerCase()] = animation;
				});

				this.newAnim();		
                this.renderer.setAnimationLoop( this.render.bind(this) );
			},
			err => {
				console.error( err );
			}
		);
	}			
    
	newAnim(){
		this.keyHandler();
		setTimeout( this.newAnim.bind(this), 50 );
	}

	set action(name){
		if (this.actionName == name.toLowerCase()) return;
				
		const clip = this.animations[name.toLowerCase()];

		if (clip!==undefined){
			const action = this.mixer.clipAction( clip );
			action.reset();
			this.actionName = name.toLowerCase();
			action.play();
			if (this.curAction){ this.curAction.crossFadeTo(action, 0.5); }
			this.curAction = action;
		}
	}

	render() {
		const dt = this.clock.getDelta();
		if (this.mixer !== undefined) this.mixer.update(dt);
        this.renderer.render( this.scene, this.camera );
    }

	initKeys(){
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
        this.keys = {   
						esc: false,
						w: false,
						a: false,
						s: false,
						d: false,
						q: false,
						e: false,
						c: false,
						r: false,
                        one:false, 
                        two:false, 
                        three:false, 
                        four:false, 
                    };
    }

	keyDown(e){
        console.log('keyCode:' + e.keyCode);
        switch(e.keyCode){
			case 87:
                this.keys.w = true;
                break;
            case 65:
                this.keys.a = true;
                break;
            case 83:
                this.keys.s = true;
                break;
            case 68:
                this.keys.d = true;
                break;
            case 81:
                this.keys.q = true;
                break;
			case 69:
				this.keys.e = true;
				break;
			case 67:
				this.keys.c = true;
				break;
			case 82:
				this.keys.r = true;
				break;
            case 49:
                this.keys.one = true;
                break;
            case 50:
                this.keys.two = true;
                break;
            case 51:
                this.keys.three = true;
                break;
            case 52:
                this.keys.four = true;
                break;                                       
        }
    }

	keyUp(e){
        switch(e.keyCode){
			case 87:
                this.keys.w = false;
                break;
            case 65:
                this.keys.a = false;
                break;
            case 83:
                this.keys.s = false;
                break;
            case 68:
                this.keys.d = false;
                break;
            case 81:
                this.keys.q = false;
                break;
			case 69:
				this.keys.e = false;
				break;
			case 67:
				this.keys.c = false;
				break;
			case 82:
				this.keys.r = false;
				break;						
            case 49:
                this.keys.one = false;				
                break;
            case 50:
                this.keys.two = false;
                break;
            case 51:
                this.keys.three = false;
                break;
            case 52:
                this.keys.four = false;
                break;                             
        }
    }

	keyHandler(){

		if (this.keys.w && this.keys.a ) {this.action = 'run';}
			else if (this.keys.w && this.keys.d) {this.action = 'crwalk';}
			else if (this.keys.w) {this.action = 'walk';}
		if (this.keys.s && this.keys.d) {this.action = 'crwalkb';}
        	else if (this.keys.s) { this.action = 'walkb'; }
			else if (!this.keys.s && !this.keys.w && this.keys.d) { this.action = 'crouch'; }

		if (this.keys.q) { this.action = 'kick'; }
        if (this.keys.e) { this.action = 'punch'; }

		if (this.keys.a && this.keys.r) { this.action = 'rjump'; }
		if (!this.keys.w && !this.keys.a && this.keys.r) { this.action = 'jump'; }

        if (this.keys.one) { this.action = 'idle'; }
		if (this.keys.two) { this.action = 'die'; }
		if (this.keys.three) { this.action = 'stop'; }
		if (this.keys.four) { this.action = 'dance'; }
    }

}

export { Game };