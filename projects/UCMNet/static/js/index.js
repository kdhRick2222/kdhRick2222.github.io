// LR Demo Logic
function initGeneratedLRVisualQuality() {
    const stepSlider = document.getElementById('glvq-slider');
    const sliderShell = document.getElementById('glvq-slider-shell');
    const labels = Array.from(document.querySelectorAll('.glvq-slider-label'));
    const setButtons = Array.from(document.querySelectorAll('.glvq-set-button'));

    const bicubicImage = document.getElementById('glvq-bicubic-image');
    const degflowImage = document.getElementById('glvq-degflow-image');

    const compare = document.getElementById('glvq-compare');
    const compareSlider = document.getElementById('glvq-compare-range');
    const compareDivider = document.getElementById('glvq-compare-divider');
    const leftLabel = document.querySelector('.glvq-compare-label-left');
    const rightLabel = document.querySelector('.glvq-compare-label-right');

    if (!stepSlider || !sliderShell || !bicubicImage || !degflowImage || !compare || !compareSlider || !compareDivider) {
        return;
    }

    const state = {
        currentSet: 'set1'
    };

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function buildFramePath(setName, methodName, index) {
        const idx = String(index).padStart(2, '0');
        return `./static/images/generated_lr_visual_quality/${setName}/${methodName}/frame_${idx}.png`;
    }

    function positionLabels() {
        const shellWidth = sliderShell.clientWidth;
        const min = Number(stepSlider.min);
        const max = Number(stepSlider.max);
        const steps = max - min;

        labels.forEach(function (label) {
            const index = Number(label.dataset.index);
            const ratio = steps === 0 ? 0 : (index - min) / steps;
            const x = ratio * shellWidth;
            label.style.left = `${x}px`;
        });
    }

    function updateActiveStepLabel(index) {
        labels.forEach(function (label) {
            const labelIndex = Number(label.dataset.index);
            label.classList.toggle('is-active', labelIndex === index);
        });
    }

    function clearActiveStepLabels() {
        labels.forEach(function (label) {
            label.classList.remove('is-active');
        });
    }

    function updateImages(index) {
        const min = Number(stepSlider.min);
        const max = Number(stepSlider.max);
        const clampedIndex = clamp(index, min, max);

        bicubicImage.src = buildFramePath(state.currentSet, 'bicubic', clampedIndex);
        degflowImage.src = buildFramePath(state.currentSet, 'degflow', clampedIndex);

        const representativeIndices = new Set([0, 9, 19, 30]);
        if (representativeIndices.has(clampedIndex)) {
            updateActiveStepLabel(clampedIndex);
        } else {
            clearActiveStepLabels();
        }
    }

    function updateActiveSetButton(setName) {
        setButtons.forEach(function (button) {
            button.classList.toggle('is-active', button.dataset.set === setName);
        });
    }

    function updateCompareLabelVisibility(value) {
        if (!leftLabel || !rightLabel) return;

        const leftOpacity = clamp((value - 10) / 18, 0, 1);
        const rightOpacity = clamp((90 - value) / 18, 0, 1);

        leftLabel.style.opacity = String(leftOpacity);
        rightLabel.style.opacity = String(rightOpacity);
    }

    function updateCompareUI(value) {
        compare.style.setProperty('--split', value + '%');
        compareDivider.style.left = value + '%';
        updateCompareLabelVisibility(value);
    }

    function updateCompareFromPointer(event) {
        const rect = compare.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const value = clamp((x / rect.width) * 100, 0, 100);

        compareSlider.value = value;
        updateCompareUI(value);
    }

    function updateStepFromPointer(event) {
        const rect = stepSlider.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const min = Number(stepSlider.min);
        const max = Number(stepSlider.max);
        const ratio = clamp(x / rect.width, 0, 1);
        const value = Math.round(min + ratio * (max - min));

        stepSlider.value = value;
        updateImages(value);
    }

    stepSlider.addEventListener('input', function () {
        updateImages(Number(stepSlider.value));
    });

    stepSlider.addEventListener('pointermove', function (event) {
        updateStepFromPointer(event);
    });

    labels.forEach(function (label) {
        label.addEventListener('click', function () {
            const index = Number(label.dataset.index);
            stepSlider.value = index;
            updateImages(index);
        });
    });

    setButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            state.currentSet = button.dataset.set;
            updateActiveSetButton(state.currentSet);

            stepSlider.value = stepSlider.max;
            updateImages(Number(stepSlider.value));
        });
    });

    compareSlider.addEventListener('input', function () {
        updateCompareUI(Number(compareSlider.value));
    });

    compare.addEventListener('mousemove', function (event) {
        updateCompareFromPointer(event);
    });

    compare.addEventListener('mouseenter', function (event) {
        updateCompareFromPointer(event);
    });

    window.addEventListener('resize', positionLabels);

    positionLabels();
    updateActiveSetButton(state.currentSet);
    updateImages(Number(stepSlider.value));
    updateCompareUI(Number(compareSlider.value));
}

document.addEventListener('DOMContentLoaded', function () {
    initGeneratedLRVisualQuality();
});


// Trajectory Demo Logic
function initTrajectoryDemo() {
    const sequence = document.getElementById('trajectory-sequence');
    const anchors = Array.from(document.querySelectorAll('.trajectory-anchor'));
    const frameCards = Array.from(document.querySelectorAll('.trajectory-seq-card'));
    const setButtons = Array.from(document.querySelectorAll('.trajectory-set-button'));

    if (!sequence || anchors.length === 0 || frameCards.length === 0) {
        return;
    }

    const datasets = {
        set1: {
            real: [
                './static/images/trajectory/set1/hr.png',
                './static/images/trajectory/set1/lr_x2.png',
                './static/images/trajectory/set1/lr_x3.png',
                './static/images/trajectory/set1/lr_x4.png'
            ],
            frames: [
                './static/images/trajectory/set1/frame_00.png',
                './static/images/trajectory/set1/frame_01.png',
                './static/images/trajectory/set1/frame_02.png',
                './static/images/trajectory/set1/frame_03.png',
                './static/images/trajectory/set1/frame_04.png',
                './static/images/trajectory/set1/frame_05.png',
                './static/images/trajectory/set1/frame_06.png'
            ]
        },
        set2: {
            real: [
                './static/images/trajectory/set2/hr.png',
                './static/images/trajectory/set2/lr_x2.png',
                './static/images/trajectory/set2/lr_x3.png',
                './static/images/trajectory/set2/lr_x4.png'
            ],
            frames: [
                './static/images/trajectory/set2/frame_00.png',
                './static/images/trajectory/set2/frame_01.png',
                './static/images/trajectory/set2/frame_02.png',
                './static/images/trajectory/set2/frame_03.png',
                './static/images/trajectory/set2/frame_04.png',
                './static/images/trajectory/set2/frame_05.png',
                './static/images/trajectory/set2/frame_06.png'
            ]
        },
        set3: {
            real: [
                './static/images/trajectory/set3/hr.png',
                './static/images/trajectory/set3/lr_x2.png',
                './static/images/trajectory/set3/lr_x3.png',
                './static/images/trajectory/set3/lr_x4.png'
            ],
            frames: [
                './static/images/trajectory/set3/frame_00.png',
                './static/images/trajectory/set3/frame_01.png',
                './static/images/trajectory/set3/frame_02.png',
                './static/images/trajectory/set3/frame_03.png',
                './static/images/trajectory/set3/frame_04.png',
                './static/images/trajectory/set3/frame_05.png',
                './static/images/trajectory/set3/frame_06.png'
            ]
        }
    };

    const frames = [
        { index: 0, anchorIndex: 0 },
        { index: 1, anchorIndex: null },
        { index: 2, anchorIndex: 1 },
        { index: 3, anchorIndex: null },
        { index: 4, anchorIndex: 2 },
        { index: 5, anchorIndex: null },
        { index: 6, anchorIndex: 3 }
    ];

    let currentIndex = 0;
    let timerId = null;
    let isPaused = false;
    let currentSet = 'set1';

    function clearActiveAnchors() {
        anchors.forEach(function (anchor) {
            anchor.classList.remove('is-active');
        });
    }

    function updateFrameClasses(activeIndex) {
        frameCards.forEach(function (card, index) {
            card.classList.remove('trajectory-seq-card--active', 'trajectory-seq-card--near');

            if (index === activeIndex) {
                card.classList.add('trajectory-seq-card--active');
            } else if (Math.abs(index - activeIndex) === 1) {
                card.classList.add('trajectory-seq-card--near');
            }
        });
    }

    function renderFrame(index) {
        const frame = frames[index];
        updateFrameClasses(frame.index);
        clearActiveAnchors();

        if (frame.anchorIndex !== null && anchors[frame.anchorIndex]) {
            anchors[frame.anchorIndex].classList.add('is-active');
        }
    }

    function getFrameDelay(index) {
        if (index === 2 || index === 4 || index === 6) {
            return 1450;
        }
        return 720;
    }

    function stopAnimation() {
        clearTimeout(timerId);
        timerId = null;
    }

    function scheduleNextFrame() {
        stopAnimation();

        if (isPaused) {
            return;
        }

        timerId = setTimeout(function () {
            currentIndex = (currentIndex + 1) % frames.length;
            renderFrame(currentIndex);
            scheduleNextFrame();
        }, getFrameDelay(currentIndex));
    }

    function applyDataset(setName) {
        const dataset = datasets[setName];
        if (!dataset) return;

        currentSet = setName;

        const anchorImages = [
            anchors[0].querySelector('img'),
            anchors[1].querySelector('img'),
            anchors[2].querySelector('img'),
            anchors[3].querySelector('img')
        ];

        const frameImages = frameCards.map(function (card) {
            return card.querySelector('img');
        });

        dataset.real.forEach(function (src, idx) {
            if (anchorImages[idx]) {
                anchorImages[idx].src = src;
            }
        });

        dataset.frames.forEach(function (src, idx) {
            if (frameImages[idx]) {
                frameImages[idx].src = src;
            }
        });

        setButtons.forEach(function (button) {
            button.classList.toggle('is-active', button.dataset.set === setName);
        });

        currentIndex = 0;
        clearActiveAnchors();
        renderFrame(currentIndex);
        stopAnimation();

        if (!isPaused) {
            scheduleNextFrame();
        }
    }

    sequence.addEventListener('mouseenter', function () {
        isPaused = true;
        stopAnimation();
    });

    sequence.addEventListener('mouseleave', function () {
        isPaused = false;
        scheduleNextFrame();
    });

    frameCards.forEach(function (card, index) {
        card.addEventListener('mouseenter', function () {
            currentIndex = index;
            isPaused = true;
            stopAnimation();
            renderFrame(currentIndex);
        });

        card.addEventListener('mouseleave', function () {
            isPaused = false;
            scheduleNextFrame();
        });
    });

    setButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            isPaused = false;
            applyDataset(button.dataset.set);
        });
    });

    applyDataset(currentSet);
    renderFrame(currentIndex);
    scheduleNextFrame();
}

document.addEventListener('DOMContentLoaded', function () {
    initTrajectoryDemo();
});


// Visual Quality Section Logic


function initVisualQualityTriptych() {
    const compareBlocks = Array.from(document.querySelectorAll('.vq-compare'));

    if (compareBlocks.length === 0) {
        return;
    }

    compareBlocks.forEach(function (block) {
        const slider = block.querySelector('.vq-compare-range');
        const overlay = block.querySelector('.vq-compare-overlay');
        const divider = block.querySelector('.vq-compare-divider');
        const leftLabel = block.querySelector('.vq-compare-label-left');
        const rightLabel = block.querySelector('.vq-compare-label-right');

        if (!slider || !overlay || !divider) {
            return;
        }

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }

        function updateLabelVisibility(value) {
            if (!leftLabel || !rightLabel) return;

            const leftOpacity = clamp((value - 10) / 18, 0, 1);
            const rightOpacity = clamp((90 - value) / 18, 0, 1);

            leftLabel.style.opacity = String(leftOpacity);
            rightLabel.style.opacity = String(rightOpacity);
        }

        function updateSliderUI(value) {
            block.style.setProperty('--split', value + '%');
            divider.style.left = value + '%';
            updateLabelVisibility(value);
        }

        function updateFromPointer(event) {
            const rect = block.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const value = clamp((x / rect.width) * 100, 0, 100);

            slider.value = value;
            updateSliderUI(value);
        }

        slider.addEventListener('input', function () {
            updateSliderUI(Number(slider.value));
        });

        block.addEventListener('mousemove', function (event) {
            updateFromPointer(event);
        });

        block.addEventListener('mouseenter', function (event) {
            updateFromPointer(event);
        });

        updateSliderUI(Number(slider.value));
    });
}

function initVisualQualityModelButtons() {
    const modelButtons = Array.from(document.querySelectorAll('#vq-model-buttons .vq-button'));
    const sets = Array.from(document.querySelectorAll('#vq-fixed-panel .vq-set'));

    if (modelButtons.length === 0 || sets.length === 0) {
        return;
    }

function updateModel(modelName) {
    sets.forEach(function (setEl) {
        const setName = setEl.dataset.set;

        const overviewImage = setEl.querySelector('.vq-overview-image');
        const hrImage = setEl.querySelector('.vq-hr-image');
        const lrImage = setEl.querySelector('.vq-lr-image');
        const interflowImage = setEl.querySelector('.vq-interflow-image');
        const degflowImage = setEl.querySelector('.vq-degflow-image');

        if (overviewImage) {
            overviewImage.src = `./static/images/visual_quality_triptych/${modelName}/${setName}/overview.png`;

            /* 기본값 초기화 */
            overviewImage.style.objectPosition = 'center center';

            /* han의 set3만 위로 올리기 */
            if (modelName === 'han' && setName === 'set3') {
                overviewImage.style.objectPosition = 'center 80%';
            }

            /* swinir set1 */
            if (modelName === 'swinir' && setName === 'set1') {
                overviewImage.style.objectPosition = 'center 80%';
            }

            /* swinir set3 */
            if (modelName === 'swinir' && setName === 'set3') {
                overviewImage.style.objectPosition = 'center 100%';
            }

            /* mambair set3 */
            if (modelName === 'mambair' && setName === 'set3') {
                overviewImage.style.objectPosition = 'center 10%';
            }
        }

        if (hrImage) {
            hrImage.src = `./static/images/visual_quality_triptych/${modelName}/${setName}/hr.png`;
        }
        if (lrImage) {
            lrImage.src = `./static/images/visual_quality_triptych/${modelName}/${setName}/lr.png`;
        }
        if (interflowImage) {
            interflowImage.src = `./static/images/visual_quality_triptych/${modelName}/${setName}/interflow.png`;
        }
        if (degflowImage) {
            degflowImage.src = `./static/images/visual_quality_triptych/${modelName}/${setName}/degflow.png`;
        }

        const slider = setEl.querySelector('.vq-compare-range');
        const compare = setEl.querySelector('.vq-compare');
        const divider = setEl.querySelector('.vq-compare-divider');
        const leftLabel = setEl.querySelector('.vq-compare-label-left');
        const rightLabel = setEl.querySelector('.vq-compare-label-right');

        if (slider && compare && divider) {
            slider.value = 50;
            compare.style.setProperty('--split', '50%');
            divider.style.left = '50%';
        }

        if (leftLabel) leftLabel.style.opacity = '1';
        if (rightLabel) rightLabel.style.opacity = '1';
    });

    modelButtons.forEach(function (button) {
        button.classList.toggle('is-active', button.dataset.model === modelName);
    });
}

    modelButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            updateModel(button.dataset.model);
        });
    });

    updateModel('han');
}

function initVisualQualityModeTabs() {
    const tabButtons = Array.from(document.querySelectorAll('#vq-top-tabs .vq-top-tab'));
    const fixedPanel = document.getElementById('vq-fixed-panel');
    const arbitraryPanel = document.getElementById('vq-arbitrary-panel');

    if (tabButtons.length === 0 || !fixedPanel || !arbitraryPanel) {
        return;
    }

    function updateMode(mode) {
        tabButtons.forEach(function (button) {
            button.classList.toggle('is-active', button.dataset.mode === mode);
        });

        fixedPanel.classList.toggle('is-active', mode === 'fixed');
        arbitraryPanel.classList.toggle('is-active', mode === 'arbitrary');
    }

    tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            updateMode(button.dataset.mode);
        });
    });

    updateMode('fixed');
}

document.addEventListener('DOMContentLoaded', function () {
    initVisualQualityTriptych();
    initVisualQualityModelButtons();
    initVisualQualityModeTabs();
});

// Visual Quality Section - Tab Logic
function initVisualQualityCarousel() {
    const viewport = document.getElementById('vq-carousel-viewport');
    const track = document.getElementById('vq-carousel-track');
    const prevButton = document.getElementById('vq-carousel-prev');
    const nextButton = document.getElementById('vq-carousel-next');

    if (!viewport || !track || !prevButton || !nextButton) {
        return;
    }

    const slides = Array.from(track.querySelectorAll('.vq-carousel-slide'));
    const totalSlides = slides.length;

    if (totalSlides === 0) {
        return;
    }

    let currentIndex = 0;
    let timerId = null;
    let isPaused = false;
    const intervalMs = 4200;

    function renderSlide() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        renderSlide();
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        renderSlide();
    }

    function stopAutoPlay() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function startAutoPlay() {
        stopAutoPlay();
        if (isPaused) return;

        timerId = setInterval(function () {
            goToNext();
        }, intervalMs);
    }

    viewport.addEventListener('mouseenter', function () {
        isPaused = true;
        stopAutoPlay();
    });

    viewport.addEventListener('mouseleave', function () {
        isPaused = false;
        startAutoPlay();
    });

    prevButton.addEventListener('click', function () {
        goToPrev();
        startAutoPlay();
    });

    nextButton.addEventListener('click', function () {
        goToNext();
        startAutoPlay();
    });

    renderSlide();
    startAutoPlay();
}

document.addEventListener('DOMContentLoaded', function () {
    initVisualQualityCarousel();
});