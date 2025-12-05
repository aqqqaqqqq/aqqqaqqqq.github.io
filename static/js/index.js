window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: false,
			autoplay: false,
			autoplaySpeed: 100000,
    }
		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
    bulmaSlider.attach();

	(function() {
        const container = document.getElementById('smpl-container');

        // 场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // 相机
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 3);

        // 渲染器
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // 控制器
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);
        controls.update();

        // 灯光
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 1, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(3, 10, 10);
        scene.add(dirLight);

        // GLTFLoader 加载 SMPL 模型
        const loader = new THREE.GLTFLoader();
        loader.load('static/models/smpl_model.glb', function(gltf) {
            const model = gltf.scene;
            model.position.set(0, 0, 0);
            scene.add(model);
        }, undefined, function(error) {
            console.error('Error loading SMPL model:', error);
        });

        // 渲染循环
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        // 窗口缩放处理
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    })();
})
