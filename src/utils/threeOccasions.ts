import * as THREE from 'three';
import { GiftIdea } from '../types';

export type OccasionType =
  | 'birthday'
  | 'anniversary'
  | 'diwali'
  | 'valentines'
  | 'christmas'
  | 'graduation'
  | 'housewarming'
  | 'studio';

export interface OccasionInfo {
  id: OccasionType;
  name: string;
  badge: string;
  icon: string;
  haloColor: number;
  ambientTint: number;
  description: string;
}

export const OCCASION_CATALOG: Record<OccasionType, OccasionInfo> = {
  birthday: {
    id: 'birthday',
    name: 'Birthday Party',
    badge: '🎂 Birthday',
    icon: '🎂',
    haloColor: 0xf59e0b,
    ambientTint: 0xffedd5,
    description: 'Floating metallic party balloons, tumbling confetti streamers & vibrant celebratory aura'
  },
  anniversary: {
    id: 'anniversary',
    name: 'Anniversary & Romance',
    badge: '💍 Anniversary',
    icon: '💍',
    haloColor: 0xf43f5e,
    ambientTint: 0xffe4e6,
    description: 'Pulsing ruby velvet hearts, cascading fragrant rose petals & champagne shimmer'
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali & Indian Festive',
    badge: '🪔 Diwali',
    icon: '🪔',
    haloColor: 0xeab308,
    ambientTint: 0xfef08a,
    description: 'Traditional sculpted brass Diyas with flickering oil flames & golden marigold floral shower'
  },
  valentines: {
    id: 'valentines',
    name: "Valentine's Day",
    badge: "💖 Valentine's",
    icon: '💖',
    haloColor: 0xec4899,
    ambientTint: 0xfce7f3,
    description: 'Beating rose-gold hearts, fluttering crimson petals & romantic atmospheric glow'
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas & Winter Holiday',
    badge: '🎄 Christmas',
    icon: '🎄',
    haloColor: 0x38bdf8,
    ambientTint: 0xe0f2fe,
    description: 'Crystalline 3D drifting snowflakes & twinkling holiday fairy light garland'
  },
  graduation: {
    id: 'graduation',
    name: 'Graduation & Milestone',
    badge: '🎓 Graduation',
    icon: '🎓',
    haloColor: 0x6366f1,
    ambientTint: 0xe0e7ff,
    description: 'Floating academic mortarboard cap with swaying tassel & orbiting victory stars'
  },
  housewarming: {
    id: 'housewarming',
    name: 'Housewarming & Home',
    badge: '🏡 Housewarming',
    icon: '🏡',
    haloColor: 0x10b981,
    ambientTint: 0xdcfce7,
    description: 'Warm hearth lantern glow, eucalyptus botanicals & cozy welcome aura'
  },
  studio: {
    id: 'studio',
    name: 'Minimal Studio Pro',
    badge: '🕊️ Minimal',
    icon: '🕊️',
    haloColor: 0xffffff,
    ambientTint: 0xffffff,
    description: 'Clean pro commercial lighting stage without celebratory props'
  }
};

export function detectOccasion(rawOccasion?: string, gift?: GiftIdea): OccasionType {
  const text = `${rawOccasion || ''} ${gift?.reason || ''} ${gift?.gift || ''}`.toLowerCase();
  if (text.includes('birthday') || text.includes('bday') || text.includes('turning')) return 'birthday';
  if (text.includes('anniversary') || text.includes('wedding') || text.includes('marriage')) return 'anniversary';
  if (text.includes('diwali') || text.includes('festiv') || text.includes('deepavali') || text.includes('navratri') || text.includes('eid') || text.includes('pooja') || text.includes('puja')) return 'diwali';
  if (text.includes('valentin') || text.includes('romantic') || text.includes('date night') || text.includes('proposal')) return 'valentines';
  if (text.includes('christmas') || text.includes('xmas') || text.includes('new year') || text.includes('holiday') || text.includes('winter')) return 'christmas';
  if (text.includes('graduat') || text.includes('degree') || text.includes('college') || text.includes('promotion') || text.includes('milestone')) return 'graduation';
  if (text.includes('housewarm') || text.includes('new home') || text.includes('apartment') || text.includes('moving')) return 'housewarming';
  return 'birthday';
}

export interface OccasionAnimationState {
  balloons: Array<{ mesh: THREE.Group; baseY: number; offset: number }>;
  hearts: Array<{ mesh: THREE.Mesh; baseY: number; offset: number; rotSpeed: number }>;
  diyas: Array<{ flameMesh: THREE.Mesh; light: THREE.PointLight; baseIntensity: number; offset: number }>;
  particles: Array<{ mesh: THREE.Mesh; speed: number; rotSpeed: { x: number; y: number; z: number } }>;
  lanternLight?: THREE.PointLight;
  graduationCap?: { mesh: THREE.Group; tassel: THREE.Mesh };
  fairyLights?: Array<{ mesh: THREE.Mesh; offset: number }>;
  stars?: Array<{ mesh: THREE.Mesh; rotSpeed: number }>;
}

export function createEmptyOccasionState(): OccasionAnimationState {
  return {
    balloons: [],
    hearts: [],
    diyas: [],
    particles: [],
    stars: [],
    fairyLights: []
  };
}

/**
 * Procedurally generates 3D visual elements for the selected celebration occasion
 */
export function buildOccasion3DScene(
  parentGroup: THREE.Group,
  occasion: OccasionType,
  gift: GiftIdea
): OccasionAnimationState {
  // Clear previous occasion elements
  while (parentGroup.children.length > 0) {
    const child = parentGroup.children[0];
    parentGroup.remove(child);
  }

  const state = createEmptyOccasionState();

  if (occasion === 'studio') {
    return state;
  }

  if (occasion === 'birthday') {
    // 1. Floating Shiny Metallic Balloons
    const balloonConfigs = [
      { color: 0xf43f5e, pos: [-1.45, 1.25, -0.65], scale: 1.0, offset: 0 },
      { color: 0xfbbf24, pos: [1.4, 1.45, -0.5], scale: 1.05, offset: 1.2 },
      { color: 0x8b5cf6, pos: [-1.1, 1.75, 0.7], scale: 0.95, offset: 2.4 },
      { color: 0x06b6d4, pos: [1.25, 1.6, 0.65], scale: 0.98, offset: 3.6 }
    ];

    balloonConfigs.forEach(cfg => {
      const balloonGroup = new THREE.Group();
      balloonGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);

      // Balloon body (spherical with slight elongation)
      const bodyGeo = new THREE.SphereGeometry(0.3, 24, 20);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.12,
        metalness: 0.85,
        envMapIntensity: 1.2
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.scale.set(1 * cfg.scale, 1.25 * cfg.scale, 1 * cfg.scale);
      body.castShadow = true;
      balloonGroup.add(body);

      // Balloon knot at bottom
      const knotGeo = new THREE.ConeGeometry(0.045, 0.08, 12);
      const knot = new THREE.Mesh(knotGeo, bodyMat);
      knot.position.y = -0.36 * cfg.scale;
      knot.rotation.x = Math.PI;
      balloonGroup.add(knot);

      // Hanging string
      const stringGeo = new THREE.CylinderGeometry(0.003, 0.003, 1.1, 6);
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
      const stringMesh = new THREE.Mesh(stringGeo, stringMat);
      stringMesh.position.y = -0.9 * cfg.scale;
      balloonGroup.add(stringMesh);

      parentGroup.add(balloonGroup);
      state.balloons.push({
        mesh: balloonGroup,
        baseY: cfg.pos[1],
        offset: cfg.offset
      });
    });

    // 2. Confetti Streamers
    const confettiColors = [0xf43f5e, 0xfbbf24, 0x10b981, 0x06b6d4, 0xa855f7, 0xf97316];
    const confettiCount = 55;
    const confettiGeo = new THREE.PlaneGeometry(0.075, 0.04);

    for (let i = 0; i < confettiCount; i++) {
      const col = confettiColors[i % confettiColors.length];
      const confettiMat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.4,
        metalness: 0.3,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(confettiGeo, confettiMat);
      mesh.position.set(
        (Math.random() - 0.5) * 4.0,
        Math.random() * 3.2 - 0.7,
        (Math.random() - 0.5) * 4.0
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      parentGroup.add(mesh);

      state.particles.push({
        mesh,
        speed: 0.35 + Math.random() * 0.45,
        rotSpeed: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
          z: (Math.random() - 0.5) * 4
        }
      });
    }
  } else if (occasion === 'anniversary' || occasion === 'valentines') {
    // 1. Floating 3D Extruded Hearts
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.15);
    heartShape.bezierCurveTo(0, 0.45, -0.32, 0.55, -0.32, 0.25);
    heartShape.bezierCurveTo(-0.32, -0.05, 0, -0.32, 0, -0.48);
    heartShape.bezierCurveTo(0, -0.32, 0.32, -0.05, 0.32, 0.25);
    heartShape.bezierCurveTo(0.32, 0.55, 0, 0.45, 0, 0.15);

    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    const heartConfigs = [
      { color: 0xbe123c, pos: [1.35, 1.35, -0.4], scale: 0.85, rotY: -0.3, offset: 0 },
      { color: 0xfbbf24, pos: [-1.3, 1.2, -0.35], scale: 0.7, rotY: 0.35, offset: 1.5 },
      { color: 0xf43f5e, pos: [0.95, 1.8, 0.6], scale: 0.55, rotY: -0.2, offset: 2.8 }
    ];

    heartConfigs.forEach(cfg => {
      const heartMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.3,
        metalness: 0.65,
        envMapIntensity: 1.1
      });
      const heartMesh = new THREE.Mesh(heartGeo, heartMat);
      heartMesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      heartMesh.scale.set(cfg.scale, cfg.scale, cfg.scale);
      heartMesh.rotation.y = cfg.rotY;
      heartMesh.rotation.z = Math.PI; // Correct orientation
      heartMesh.castShadow = true;
      parentGroup.add(heartMesh);

      state.hearts.push({
        mesh: heartMesh,
        baseY: cfg.pos[1],
        offset: cfg.offset,
        rotSpeed: (Math.random() - 0.5) * 0.4
      });
    });

    // 2. Cascading Fragrant Rose Petals
    const petalColors = [0x9f1239, 0xe11d48, 0xfb7185];
    const petalGeo = new THREE.SphereGeometry(0.07, 8, 8, 0, Math.PI, 0, Math.PI * 0.55);

    for (let i = 0; i < 45; i++) {
      const petalMat = new THREE.MeshStandardMaterial({
        color: petalColors[i % petalColors.length],
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(
        (Math.random() - 0.5) * 3.8,
        Math.random() * 3.2 - 0.7,
        (Math.random() - 0.5) * 3.8
      );
      petal.scale.set(1.1, 0.4, 1.0);
      parentGroup.add(petal);

      state.particles.push({
        mesh: petal,
        speed: 0.28 + Math.random() * 0.3,
        rotSpeed: {
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 2.5,
          z: (Math.random() - 0.5) * 3
        }
      });
    }
  } else if (occasion === 'diwali') {
    // 1. Realistic Sculpted Brass Diyas with Flickering Oil Flames
    const diyaPositions = [
      [-1.4, -0.68, 0.75],
      [-0.6, -0.68, 1.45],
      [0.6, -0.68, 1.45],
      [1.4, -0.68, 0.75]
    ];

    diyaPositions.forEach((pos, idx) => {
      const diyaGroup = new THREE.Group();
      diyaGroup.position.set(pos[0], pos[1], pos[2]);

      // Sculpted Brass bowl
      const bowlGeo = new THREE.CylinderGeometry(0.18, 0.1, 0.09, 24);
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.85,
        roughness: 0.28
      });
      const bowl = new THREE.Mesh(bowlGeo, brassMat);
      bowl.castShadow = true;
      bowl.receiveShadow = true;
      diyaGroup.add(bowl);

      // Flared rim ring
      const rimGeo = new THREE.TorusGeometry(0.18, 0.02, 12, 24);
      const rim = new THREE.Mesh(rimGeo, brassMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.045;
      diyaGroup.add(rim);

      // Clay oil well inner liquid (deep golden oil)
      const oilGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16);
      const oilMat = new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.1,
        metalness: 0.2
      });
      const oil = new THREE.Mesh(oilGeo, oilMat);
      oil.position.y = 0.035;
      diyaGroup.add(oil);

      // Cotton wick
      const wickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8);
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.set(0, 0.06, 0.05);
      wick.rotation.x = 0.3;
      diyaGroup.add(wick);

      // 3D Teardrop Glowing Flame
      const flameGeo = new THREE.ConeGeometry(0.042, 0.13, 16);
      const flameMat = new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: 0xf59e0b,
        emissiveIntensity: 3.5,
        roughness: 0.2
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(0, 0.12, 0.07);
      diyaGroup.add(flameMesh);

      // Inner flame nucleus
      const coreGeo = new THREE.SphereGeometry(0.022, 10, 10);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, 0.08, 0.07);
      diyaGroup.add(core);

      // Dynamic flickering candlelight point-light
      const diyaLight = new THREE.PointLight(0xf59e0b, 2.2, 3.5);
      diyaLight.position.set(0, 0.2, 0.07);
      diyaGroup.add(diyaLight);

      parentGroup.add(diyaGroup);

      state.diyas.push({
        flameMesh,
        light: diyaLight,
        baseIntensity: 2.2,
        offset: idx * 1.6
      });
    });

    // 2. Floating Golden Marigold & Jasmine Petals
    const marigoldColors = [0xf97316, 0xfacc15, 0xfef08a];
    const marigoldGeo = new THREE.CircleGeometry(0.048, 8);

    for (let i = 0; i < 48; i++) {
      const col = marigoldColors[i % marigoldColors.length];
      const mMat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const petal = new THREE.Mesh(marigoldGeo, mMat);
      petal.position.set(
        (Math.random() - 0.5) * 3.8,
        Math.random() * 3.0 - 0.7,
        (Math.random() - 0.5) * 3.8
      );
      parentGroup.add(petal);

      state.particles.push({
        mesh: petal,
        speed: 0.22 + Math.random() * 0.28,
        rotSpeed: {
          x: (Math.random() - 0.5) * 2.8,
          y: (Math.random() - 0.5) * 3.2,
          z: (Math.random() - 0.5) * 2.8
        }
      });
    }
  } else if (occasion === 'christmas') {
    // 1. 3D Crystalline Snowflakes
    const snowCount = 42;
    for (let i = 0; i < snowCount; i++) {
      const snowflakeGroup = new THREE.Group();
      const armGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.22, 6);
      const iceMat = new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
      });

      // 3 crossed arms creating 6-point snowflake
      for (let a = 0; a < 3; a++) {
        const arm = new THREE.Mesh(armGeo, iceMat);
        arm.rotation.z = (a * Math.PI) / 3;
        snowflakeGroup.add(arm);
      }

      snowflakeGroup.position.set(
        (Math.random() - 0.5) * 4.0,
        Math.random() * 3.4 - 0.7,
        (Math.random() - 0.5) * 4.0
      );
      parentGroup.add(snowflakeGroup);

      state.particles.push({
        mesh: snowflakeGroup as unknown as THREE.Mesh,
        speed: 0.25 + Math.random() * 0.35,
        rotSpeed: {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 2.0,
          z: (Math.random() - 0.5) * 1.5
        }
      });
    }

    // 2. Twinkling Holiday Fairy Lights along Pedestal
    const fairyCount = 18;
    const fairyColors = [0xef4444, 0x10b981, 0xfbbf24, 0x38bdf8];
    const fairyGeo = new THREE.SphereGeometry(0.038, 10, 10);

    for (let i = 0; i < fairyCount; i++) {
      const angle = (i / fairyCount) * Math.PI * 2;
      const radius = 2.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const col = fairyColors[i % fairyColors.length];
      const fairyMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.85
      });
      const lightSphere = new THREE.Mesh(fairyGeo, fairyMat);
      lightSphere.position.set(x, -0.7, z);
      parentGroup.add(lightSphere);

      state.fairyLights?.push({
        mesh: lightSphere,
        offset: i * 0.7
      });
    }
  } else if (occasion === 'graduation') {
    // 1. Floating 3D Academic Mortarboard Cap
    const capGroup = new THREE.Group();
    capGroup.position.set(1.25, 1.45, -0.35);

    // Skull cap base
    const skullGeo = new THREE.CylinderGeometry(0.24, 0.27, 0.14, 24);
    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.75,
      metalness: 0.1
    });
    const skull = new THREE.Mesh(skullGeo, blackMat);
    capGroup.add(skull);

    // Mortarboard square top
    const topGeo = new THREE.BoxGeometry(0.65, 0.035, 0.65);
    const topMesh = new THREE.Mesh(topGeo, blackMat);
    topMesh.position.y = 0.08;
    topMesh.rotation.y = Math.PI / 4;
    capGroup.add(topMesh);

    // Golden center button
    const btnGeo = new THREE.SphereGeometry(0.03, 12, 12);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.2
    });
    const button = new THREE.Mesh(btnGeo, goldMat);
    button.position.y = 0.105;
    capGroup.add(button);

    // Golden tassel dangling
    const tasselGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.26, 8);
    const tassel = new THREE.Mesh(tasselGeo, goldMat);
    tassel.position.set(0.25, -0.06, 0.2);
    capGroup.add(tassel);

    parentGroup.add(capGroup);
    state.graduationCap = { mesh: capGroup, tassel };

    // 2. Orbiting Victory Golden Stars
    const starShape = new THREE.Shape();
    const starPoints = 5;
    const outerRadius = 0.14;
    const innerRadius = 0.065;
    for (let p = 0; p < starPoints * 2; p++) {
      const r = p % 2 === 0 ? outerRadius : innerRadius;
      const a = (p * Math.PI) / starPoints;
      const x = Math.sin(a) * r;
      const y = Math.cos(a) * r;
      if (p === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    const starExtrude = { depth: 0.03, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.01, bevelThickness: 0.01 };
    const starGeo = new THREE.ExtrudeGeometry(starShape, starExtrude);

    for (let s = 0; s < 6; s++) {
      const starMesh = new THREE.Mesh(starGeo, goldMat);
      starMesh.position.set(
        (Math.random() - 0.5) * 3.5,
        Math.random() * 2.2 + 0.3,
        (Math.random() - 0.5) * 3.5
      );
      parentGroup.add(starMesh);

      state.stars?.push({
        mesh: starMesh,
        rotSpeed: 0.8 + Math.random() * 0.8
      });
    }

    // 3. Gold & Silver celebratory confetti
    for (let i = 0; i < 35; i++) {
      const cGeo = new THREE.PlaneGeometry(0.07, 0.035);
      const cMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xfbbf24 : 0xe2e8f0,
        metalness: 0.8,
        roughness: 0.2,
        side: THREE.DoubleSide
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(
        (Math.random() - 0.5) * 3.6,
        Math.random() * 3.0 - 0.7,
        (Math.random() - 0.5) * 3.6
      );
      parentGroup.add(cMesh);

      state.particles.push({
        mesh: cMesh,
        speed: 0.3 + Math.random() * 0.4,
        rotSpeed: {
          x: (Math.random() - 0.5) * 3.5,
          y: (Math.random() - 0.5) * 3.5,
          z: (Math.random() - 0.5) * 3.5
        }
      });
    }
  } else if (occasion === 'housewarming') {
    // 1. Cozy Vintage Hearth Lantern
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(1.35, -0.68, 0.7);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.4 });
    const baseGeo = new THREE.BoxGeometry(0.26, 0.04, 0.26);
    const base = new THREE.Mesh(baseGeo, ironMat);
    lanternGroup.add(base);

    const roofGeo = new THREE.ConeGeometry(0.18, 0.12, 4);
    const roof = new THREE.Mesh(roofGeo, ironMat);
    roof.position.y = 0.38;
    roof.rotation.y = Math.PI / 4;
    lanternGroup.add(roof);

    // Candle inside lantern
    const candleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.14, 16);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.y = 0.09;
    lanternGroup.add(candle);

    const lanternFlameGeo = new THREE.ConeGeometry(0.025, 0.07, 12);
    const lanternFlameMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const lFlame = new THREE.Mesh(lanternFlameGeo, lanternFlameMat);
    lFlame.position.y = 0.19;
    lanternGroup.add(lFlame);

    const lanternLight = new THREE.PointLight(0xfbbf24, 2.0, 3.5);
    lanternLight.position.y = 0.22;
    lanternGroup.add(lanternLight);
    state.lanternLight = lanternLight;

    parentGroup.add(lanternGroup);

    // 2. Floating Botanical Greenery Leaves
    const leafGeo = new THREE.CircleGeometry(0.055, 6);
    const leafColors = [0x15803d, 0x16a34a, 0x4ade80];

    for (let i = 0; i < 35; i++) {
      const leafMat = new THREE.MeshStandardMaterial({
        color: leafColors[i % leafColors.length],
        roughness: 0.7,
        side: THREE.DoubleSide
      });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(
        (Math.random() - 0.5) * 3.6,
        Math.random() * 3.0 - 0.7,
        (Math.random() - 0.5) * 3.6
      );
      leaf.scale.set(1.4, 0.6, 1.0);
      parentGroup.add(leaf);

      state.particles.push({
        mesh: leaf,
        speed: 0.2 + Math.random() * 0.25,
        rotSpeed: {
          x: (Math.random() - 0.5) * 2.5,
          y: (Math.random() - 0.5) * 2.5,
          z: (Math.random() - 0.5) * 2.5
        }
      });
    }
  }

  return state;
}

/**
 * High-performance per-frame animation update for occasion elements
 */
export function updateOccasionAnimation(
  state: OccasionAnimationState,
  elapsed: number,
  delta: number
) {
  // 1. Balloons bobbing & swaying
  state.balloons.forEach(b => {
    b.mesh.position.y = b.baseY + Math.sin(elapsed * 1.6 + b.offset) * 0.08;
    b.mesh.rotation.z = Math.sin(elapsed * 1.2 + b.offset) * 0.06;
  });

  // 2. Hearts pulsing with heartbeat rhythm
  state.hearts.forEach(h => {
    const pulse = 1 + Math.sin(elapsed * 2.8 + h.offset) * 0.06;
    h.mesh.scale.set(pulse, pulse, pulse);
    h.mesh.position.y = h.baseY + Math.sin(elapsed * 1.4 + h.offset) * 0.05;
    h.mesh.rotation.y += h.rotSpeed * delta;
  });

  // 3. Diya flames flickering realistically
  state.diyas.forEach(d => {
    const flicker = Math.sin(elapsed * 22 + d.offset) * 0.15 + Math.cos(elapsed * 35 + d.offset) * 0.1;
    d.flameMesh.scale.y = 1 + flicker;
    d.flameMesh.scale.x = 1 - flicker * 0.4;
    d.light.intensity = d.baseIntensity * (1 + flicker * 0.35);
  });

  // 4. Falling celebratory particles (confetti, petals, snowflakes, leaves)
  state.particles.forEach(p => {
    p.mesh.position.y -= p.speed * delta;
    p.mesh.rotation.x += p.rotSpeed.x * delta;
    p.mesh.rotation.y += p.rotSpeed.y * delta;
    p.mesh.rotation.z += p.rotSpeed.z * delta;
    if (p.mesh.position.y < -0.85) {
      p.mesh.position.y = 2.4 + Math.random() * 0.6;
      p.mesh.position.x = (Math.random() - 0.5) * 4.0;
      p.mesh.position.z = (Math.random() - 0.5) * 4.0;
    }
  });

  // 5. Graduation cap tassel swaying
  if (state.graduationCap) {
    state.graduationCap.tassel.rotation.z = Math.sin(elapsed * 2.2) * 0.2;
    state.graduationCap.mesh.position.y = 1.45 + Math.sin(elapsed * 1.5) * 0.04;
  }

  // 6. Twinkling holiday fairy lights
  if (state.fairyLights) {
    state.fairyLights.forEach(fl => {
      const mat = fl.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(elapsed * 4.5 + fl.offset) * 0.5;
    });
  }

  // 7. Cozy lantern flame flicker
  if (state.lanternLight) {
    state.lanternLight.intensity = 1.8 + Math.sin(elapsed * 18) * 0.35;
  }

  // 8. Orbiting victory stars
  if (state.stars) {
    state.stars.forEach(s => {
      s.mesh.rotation.y += s.rotSpeed * delta;
      s.mesh.rotation.z += s.rotSpeed * 0.5 * delta;
    });
  }
}
