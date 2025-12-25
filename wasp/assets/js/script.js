$(document).ready(function () {
    // Dynamic GitHub Release Fetching
    const repoOwner = "Deadpool2000";
    const repoName = "WASP";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

    function fetchLatestRelease() {
        $.getJSON(apiUrl, function (data) {
            const version = data.tag_name;
            const zipUrl = data.zipball_url;
            const assets = data.assets;

            // Platform Asset Groups
            const winAssets = [];
            const macAssets = [];
            const linuxAssets = [];

            assets.forEach(asset => {
                const name = asset.name;
                const lowerName = name.toLowerCase();

                // Exclude the deprecated wasp.exe (small letters)
                if (name === 'wasp.exe') return;

                if (lowerName.endsWith('.exe') || lowerName.endsWith('.msi')) {
                    winAssets.push(asset);
                } else if (lowerName.endsWith('.dmg') || lowerName.endsWith('.pkg') || (lowerName.endsWith('.zip') && lowerName.includes('macos'))) {
                    macAssets.push(asset);
                } else if (lowerName.endsWith('.appimage') || lowerName.endsWith('.deb') || lowerName.endsWith('.rpm')) {
                    linuxAssets.push(asset);
                }
            });

            // Helper to render buttons
            function renderButtons(containerId, metaId, platformAssets, defaultUrl) {
                const container = $(`#${containerId}`).empty();
                if (platformAssets.length > 0) {
                    platformAssets.forEach(a => {
                        let label = a.name.split('.').pop().toUpperCase();
                        // Special handling for long extensions
                        if (label === 'APPIMAGE') label = 'AppImage';
                        container.append(`<a href="${a.browser_download_url}" class="btn btn-terminal btn-download flex-fill text-nowrap">${label}</a>`);
                    });
                    $(`#${metaId}`).text(platformAssets[0].name.split('-')[0] || 'Available Now');
                } else {
                    container.append(`<a href="${defaultUrl}" class="btn btn-terminal btn-download w-100">View Release</a>`);
                }
            }

            // --- WINDOWS ---
            winAssets.sort((a, b) => (a.name.includes('WASP') ? -1 : 1));
            renderButtons('win-download-container', 'win-meta', winAssets, data.html_url);

            // --- macOS ---
            macAssets.sort((a, b) => (a.name.endsWith('.dmg') ? -1 : 1));
            renderButtons('mac-download-container', 'mac-meta', macAssets, data.html_url);

            // --- LINUX ---
            linuxAssets.sort((a, b) => (a.name.endsWith('.AppImage') ? -1 : 1));
            renderButtons('linux-download-container', 'linux-meta', linuxAssets, data.html_url);

            // Update Global Version
            $('#wasp-brand-text').html(`<i class="fas fa-bug"></i> WASP_${version}`);
            $('#latest-version-text').text(`Windows (${version})`);
            $('#mac-version-text').text(`macOS (${version})`);
            $('#linux-version-text').text(`Linux (${version})`);
            $('#download-zip').attr('href', zipUrl);

            console.log(`%c [SYSTEM] Assets synchronized for ${version}`, "color: #00ff41;");
        }).fail(function () {
            console.error("Failed to fetch latest release from GitHub API.");
        });
    }

    fetchLatestRelease();

    // Typewriter effect for Hero Title
    const heroTitle = "W.A.S.P.";
    const heroH1 = $(".glitch");
    let i = 0;

    function typeWriter() {
        if (i < heroTitle.length) {
            heroH1.text(heroTitle.substring(0, i + 1));
            i++;
            setTimeout(typeWriter, 150);
        }
    }

    // Start typewriter after a small delay
    setTimeout(typeWriter, 500);

    // Smooth Scrolling for nav links
    $('a.nav-link, a.btn-terminal').on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 800);
        }
    });

    // Random Console Interactions
    const messages = [
        "Status: HR is suspicious but has no evidence.",
        "Status: Cursor moved 4,203 miles today.",
        "Status: Simulated 4 meetings while you were at the gym.",
        "Status: Keyboard active. Keystroke: 'ASDFGHJKL'",
        "Status: Stealth mode engaged. You are a shadow."
    ];

    setInterval(() => {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const newLine = $('<div class="text-secondary mb-2">> ' + randomMsg + '</div>');
        $('.console-output').append(newLine);

        // Keep only last 6 lines
        if ($('.console-output div').length > 6) {
            $('.console-output div').first().remove();
        }
    }, 5000);

    // Add glitch effect on hover for feature cards
    $('.feature-card').hover(
        function () {
            $(this).css('border-color', '#00ff41');
        }, function () {
            $(this).css('border-color', 'rgba(0, 255, 65, 0.1)');
        }
    );

    // Easter Egg: Console Log
    console.log("%c WASP INITIALIZED ", "background: #000; color: #00ff41; font-size: 20px; font-weight: bold;");
    console.log("If you're reading this, you're either a developer or HR. If you're HR, move along, nothing to see here.");

});
