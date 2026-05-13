
            // ── UNCHANGED: Sidebar open/close ────────────────────────────────
            function showSidebar() {
                const sidebar = document.querySelector('.sidebar');
                const menuButton = document.querySelector('.menu-button button');
                sidebar.style.display = 'flex';
                menuButton.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }

            function hideSidebar() {
                const sidebar = document.querySelector('.sidebar');
                const menuButton = document.querySelector('.menu-button button');
                sidebar.style.display = 'none';
                menuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }

            document.querySelectorAll('.sidebar a').forEach(link => {
                link.addEventListener('click', hideSidebar);
            });

            // ── CHANGE: Active nav link highlighting ─────────────────────────
            // Watches all <section id="..."> elements. When a section enters the
            // "middle band" of the screen (rootMargin excludes top 40% and bottom 55%),
            // the matching desktop nav link gets class "active".
            // CSS then shows its red underline and colors it red.
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('nav ul:not(.sidebar) a[data-section]');

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.toggle('active', link.dataset.section === entry.target.id);
                        });
                    }
                });
            }, { rootMargin: '-40% 0px -55% 0px' });

            sections.forEach(section => sectionObserver.observe(section));

            // ── CHANGE: Scroll-triggered reveal animations ───────────────────
            // Elements with class "reveal" are invisible on load (set in CSS).
            // When they scroll 12% into the viewport, "revealed" is added and
            // CSS transitions fade them up into view. unobserve() ensures each
            // element only animates in once, not every time it enters the viewport.
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target); // fire once only
                    }
                });
            }, { threshold: 0.12 });

            document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

            // ── CHANGE: Back to top button ───────────────────────────────────
            // Watches scroll position. Once past 400px, adds class "visible"
            // which fades the button in (CSS handles the opacity transition).
            // Clicking it smooth-scrolls back to the top of the page.
            const backToTopBtn = document.getElementById('back-to-top');

            window.addEventListener('scroll', () => {
                backToTopBtn.classList.toggle('visible', window.scrollY > 400);
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // ── CHANGE: Contact form submission ──────────────────────────────
            // Currently runs in demo mode (e.preventDefault stops actual submission).
            //
            // TO CONNECT FORMSPREE:
            //   1. Go to formspree.io and create a free account
            //   2. Create a new form — you'll get an ID like "xpwzabcd"
            //   3. In the <form> tag above, replace YOUR_FORM_ID with that ID
            //   4. Delete the e.preventDefault() line below
            //   5. Delete the setTimeout block below (the demo success simulation)
            //   Formspree will handle delivery and show its own success page,
            //   OR you can set a custom redirect URL in your Formspree dashboard.
            const form = document.getElementById('contact-form');
            const successMsg = document.getElementById('form-success');

            if (form) {
                form.addEventListener('submit', async (e) => {
                    const btn = form.querySelector('.btn-submit');
                    const btnText = form.querySelector('.btn-submit-text');

                    btn.disabled = true;
                    btnText.textContent = 'Sending...';
                });
            }

            // ── Blog RSS feed loader ─────────────────────────────────────────
            // Fetches the 3 most recent posts from americanbychoice.net via the
            // free rss2json.com API and renders them as cards with date, title,
            // and a 160-character excerpt. Falls back to a static card if the
            // fetch fails for any reason (network, feed change, etc.).
            async function loadBlogPosts() {
                const grid = document.getElementById('blog-grid');
                if (!grid) return;
                const feedUrl = 'https://americanbychoice.net/feed/';
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=3`;
                try {
                    const res = await fetch(apiUrl);
                    const data = await res.json();
                    if (data.status !== 'ok' || !data.items?.length) throw new Error('No posts');
                    grid.innerHTML = data.items.map(post => {
                        const date = new Date(post.pubDate).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        });
                        const excerpt = post.description
                            .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160) + '…';
                        return `
                        <article class="blog-card revealed">
                            <div class="blog-card-body">
                                <p class="blog-date">${date}</p>
                                <h3 class="blog-card-title">${post.title}</h3>
                                <p class="blog-excerpt">${excerpt}</p>
                            </div>
                            <a href="${post.link}" target="_blank" class="blog-read-more">Read Post →</a>
                        </article>`;
                    }).join('');
                } catch (err) {
                    grid.innerHTML = `
                    <article class="blog-card revealed">
                        <div class="blog-card-body">
                            <p class="blog-date">Visit the blog</p>
                            <h3 class="blog-card-title">American by Choice</h3>
                            <p class="blog-excerpt">Dr. Rahman writes about healthcare, immigration, American culture, and global business. Read the latest posts at americanbychoice.net.</p>
                        </div>
                        <a href="https://americanbychoice.net" target="_blank" class="blog-read-more">Visit Blog →</a>
                    </article>`;
                }
            }
            loadBlogPosts();