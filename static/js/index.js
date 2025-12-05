import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.addEventListener('load', function() {
    var carousels = bulmaCarousel.attach('.carousel', {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: false,
        autoplay: false,
    });
    bulmaSlider.attach();

    const container = document.getElementById('smpl-container');
    if (!container) {
        console.error('smpl-container 元素不存在！');
        return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
        60, // 扩大视角到60°，避免局部
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    // 摄像机：下移（y=0.5）+ 拉远（z=3）
    camera.position.set(0, 0.5, 3.0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    // 目标点同步下移（y=0.8），和摄像机位置匹配
    controls.target.set(0, 0.8, 0); 
    controls.enableReset = false;
    controls.minDistance = 2.0; // 防止拉太近
    controls.maxDistance = 5.0;
    controls.update();

    // 优化灯光
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 2, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);

    // 加载模型并校准视角
    const loader = new GLTFLoader();
    loader.load('static/models/smpl_model.glb', function(gltf) {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        scene.add(model);

        // 自动计算模型重心，同步调整摄像机和目标点
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        console.log('模型重心：', center);

        // 摄像机 Y = 模型重心 Y - 0.2（下移），目标点对准重心
        camera.position.y = center.y - 0.2;
        controls.target.copy(center);
        controls.update();
    }, undefined, function(error) {
        console.error('Error loading SMPL model:', error);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
