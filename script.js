/**
 * Hidden Lakes - Premium Estate Living
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initLotMap();
    initGallery();
    initLightbox();
    initContactForm();
    initScrollAnimations();
});

/* =====================================================
   NAVIGATION
   ===================================================== */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   LOT MAP - Interactive Site Plan
   ===================================================== */

// Lot data — from Exhibit A (Hidden Lakes Characteristics by Lot Pricing).
// Polygon points (normalized 0..1 to images/site-plan.jpg) from the lot-tracer export.
// To mark a lot reserved/sold, change its `status` to 'reserved' or 'sold'.
const lotData = [
  {"id": 1, "status": "available", "acres": 1.01, "sf": 43977, "dim": "152 x 289", "road": "Hidden Lakes Crossing", "type": "Walkout", "features": "Corner Lot, Lake View", "price": "$265,000", "poly": [[0.46, 0.34152], [0.49375, 0.50614], [0.56125, 0.48812], [0.51, 0.28829]]},
  {"id": 2, "status": "available", "acres": 1.01, "sf": 44085, "dim": "139 x 317", "road": "Hidden Lakes Crossing", "type": "Walkout", "features": "Lake View", "price": "$265,000", "poly": [[0.51, 0.28911], [0.56833, 0.2457], [0.60375, 0.47666], [0.56208, 0.48649]]},
  {"id": 3, "status": "available", "acres": 1.02, "sf": 44568, "dim": "137 x 325", "road": "Hidden Lakes Crossing", "type": "Walkout", "features": "Lake View", "price": "$265,000", "poly": [[0.5675, 0.24161], [0.60375, 0.47666], [0.64208, 0.44636], [0.62667, 0.22195]]},
  {"id": 4, "status": "available", "acres": 1, "sf": 43579, "dim": "145 x 298", "road": "Hidden Lakes Crossing", "type": "Walkout", "features": "Lake View", "price": "$265,000", "poly": [[0.62583, 0.21376], [0.64458, 0.44144], [0.68917, 0.40704], [0.68792, 0.20966]]},
  {"id": 5, "status": "available", "acres": 1.01, "sf": 43877, "dim": "162 x 269", "road": "Hidden Lakes Crossing", "type": "Walkout", "features": "Lake View", "price": "$265,000", "poly": [[0.68792, 0.21212], [0.68833, 0.40541], [0.75125, 0.40704], [0.74958, 0.20966]]},
  {"id": 6, "status": "available", "acres": 1.02, "sf": 42246, "dim": "164 x 269", "road": "Hidden Lakes Crossing", "type": "Walkout", "features": "", "price": "$250,000", "poly": [[0.7475, 0.20803], [0.75167, 0.40786], [0.81083, 0.40541], [0.80875, 0.20557]]},
  {"id": 7, "status": "available", "acres": 1.07, "sf": 46404, "dim": "172 x 269", "road": "Hidden Lakes Crossing", "type": "Walkout", "features": "Corner Lot (HLC & PW)", "price": "$250,000", "poly": [[0.81167, 0.20557], [0.81292, 0.40377], [0.87833, 0.40377], [0.87333, 0.20966]]},
  {"id": 8, "status": "available", "acres": 1.22, "sf": 52999, "dim": "158 x 335", "road": "Prairie Way", "type": "Walkout", "features": "Premium Lot, Lake View", "price": "$310,000", "poly": [[0.75125, 0.40541], [0.75375, 0.52007], [0.87542, 0.51597], [0.87708, 0.40377]]},
  {"id": 9, "status": "available", "acres": 1.04, "sf": 45191, "dim": "145 x 314", "road": "Lakeview Avenue", "type": "Walkout", "features": "Corner Lot (LV & PW)", "price": "$250,000", "poly": [[0.825, 0.52416], [0.825, 0.76085], [0.88042, 0.74201], [0.87833, 0.5217]]},
  {"id": 10, "status": "available", "acres": 1.02, "sf": 44272, "dim": "137 x 322", "road": "Lakeview Avenue", "type": "Walkout", "features": "", "price": "$250,000", "poly": [[0.82292, 0.52252], [0.77083, 0.52416], [0.77375, 0.76495], [0.825, 0.75921]]},
  {"id": 11, "status": "available", "acres": 1.02, "sf": 44317, "dim": "137 x 323", "road": "Lakeview Avenue", "type": "Walkout", "features": "Partial Lake View", "price": "$265,000", "poly": [[0.77083, 0.52416], [0.7725, 0.76495], [0.72333, 0.76167], [0.72125, 0.5258]]},
  {"id": 12, "status": "available", "acres": 1.01, "sf": 44075, "dim": "142 x 311", "road": "Lakeview Avenue", "type": "Walkout", "features": "Lake View", "price": "$265,000", "poly": [[0.72042, 0.52826], [0.66792, 0.55119], [0.67, 0.76495], [0.7225, 0.76331]]},
  {"id": 13, "status": "available", "acres": 1.36, "sf": 58631, "dim": "Pie shape", "road": "Lakeview Avenue", "type": "Walkout", "features": "Premium Lot, Dual Lake View", "price": "$275,000", "poly": [[0.66708, 0.54627], [0.66792, 0.76495], [0.60167, 0.76331], [0.56667, 0.7371], [0.545, 0.69206]]},
  {"id": 14, "status": "available", "acres": 1.63, "sf": 70798, "dim": "170 x 416", "road": "Lakeview Avenue", "type": "Walkout", "features": "Premium Lot, Woodland", "price": "$300,000", "poly": [[0.535, 0.73956], [0.45375, 0.86978], [0.45458, 0.9828], [0.545, 0.98034], [0.5725, 0.79279]]},
  {"id": 15, "status": "available", "acres": 1.14, "sf": 49817, "dim": "195 x 255", "road": "Lakeview Avenue", "type": "Walkout", "features": "Corner Lot (LA & BL)", "price": "$260,000", "poly": [[0.57333, 0.79934], [0.54542, 0.98116], [0.63875, 0.97543], [0.63583, 0.8231], [0.60667, 0.81327]]},
  {"id": 16, "status": "available", "acres": 1.43, "sf": 62459, "dim": "220 x 284", "road": "Lakeview Avenue", "type": "Walkout", "features": "Corner Lot (LA & BL)", "price": "$240,000", "poly": [[0.66, 0.8231], [0.65875, 0.97133], [0.76375, 0.97297], [0.7625, 0.80917]]},
  {"id": 17, "status": "available", "acres": 1.42, "sf": 61994, "dim": "226 x 273", "road": "Lakeview Avenue", "type": "Walkout", "features": "", "price": "$240,000", "poly": [[0.76167, 0.81245], [0.76542, 0.97297], [0.86917, 0.97052], [0.86792, 0.79934]]},
  {"id": 18, "status": "available", "acres": 1.48, "sf": 64634, "dim": "275 x 234", "road": "Lakeview Avenue", "type": "Walkout", "features": "", "price": "$240,000", "poly": [[0.86792, 0.79934], [0.96708, 0.79689], [0.97375, 0.96478], [0.87, 0.96888]]},
  {"id": 19, "status": "available", "acres": 0.58, "sf": 25108, "dim": "134 x 188", "road": "Prairie Way", "type": "Daylight", "features": "", "price": "$190,000", "poly": [[0.89833, 0.64619], [0.89958, 0.73956], [0.96875, 0.7412], [0.96958, 0.64292]]},
  {"id": 20, "status": "available", "acres": 0.54, "sf": 23500, "dim": "125 x 188", "road": "Prairie Way", "type": "Daylight", "features": "", "price": "$190,000", "poly": [[0.89917, 0.64701], [0.8975, 0.55774], [0.96792, 0.55774], [0.96958, 0.64128]]},
  {"id": 21, "status": "available", "acres": 0.54, "sf": 23500, "dim": "125 x 188", "road": "Prairie Way", "type": "Daylight", "features": "", "price": "$190,000", "poly": [[0.89833, 0.55201], [0.89667, 0.46437], [0.96375, 0.46028], [0.965, 0.55119]]},
  {"id": 22, "status": "available", "acres": 0.62, "sf": 27151, "dim": "145 x 188", "road": "Prairie Way", "type": "Daylight", "features": "", "price": "$190,000", "poly": [[0.89458, 0.40786], [0.89417, 0.30221], [0.96292, 0.29648], [0.96667, 0.40131]]},
  {"id": 23, "status": "available", "acres": 0.63, "sf": 27282, "dim": "119 x 230", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$190,000", "poly": [[0.93167, 0.00246], [0.90958, 0.15807], [0.955, 0.18591], [0.96375, 0.17772], [0.965, 0]]},
  {"id": 24, "status": "available", "acres": 0.56, "sf": 24263, "dim": "115 x 211", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$210,000", "poly": [[0.93375, 0.00573], [0.87708, 0.00573], [0.87833, 0.15233], [0.90833, 0.15397]]},
  {"id": 25, "status": "available", "acres": 1, "sf": 43617, "dim": "212 x 206", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$220,000", "poly": [[0.87542, 0.0041], [0.79792, 0.00737], [0.8, 0.15233], [0.87833, 0.1507]]},
  {"id": 26, "status": "available", "acres": 1, "sf": 43629, "dim": "211 x 206", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$220,000", "poly": [[0.79667, 0.00737], [0.7975, 0.15479], [0.71958, 0.15643], [0.71833, 0.00819]]},
  {"id": 27, "status": "available", "acres": 1, "sf": 43644, "dim": "211 x 207", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$225,000", "poly": [[0.71708, 0.00573], [0.63875, 0.00819], [0.645, 0.16052], [0.71708, 0.15971]]},
  {"id": 28, "status": "available", "acres": 1, "sf": 43657, "dim": "189 x 230", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$225,000", "poly": [[0.635, 0.01147], [0.64208, 0.15971], [0.57958, 0.18428], [0.55542, 0.01147]]},
  {"id": 29, "status": "available", "acres": 1, "sf": 43655, "dim": "302 x 220", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$225,000", "poly": [[0.55333, 0.00983], [0.57875, 0.18428], [0.52833, 0.21376], [0.48375, 0.01229]]},
  {"id": 30, "status": "available", "acres": 1.43, "sf": 62196, "dim": "206 x 302", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "Corner Lot (HLC & LA)", "price": "$250,000", "poly": [[0.48292, 0.01392], [0.42583, 0.01147], [0.44083, 0.08518], [0.44542, 0.28665], [0.52625, 0.21785]]},
  {"id": 31, "status": "available", "acres": 1.35, "sf": 58926, "dim": "163 x 360", "road": "Lakeview Avenue", "type": "Daylight", "features": "", "price": "$230,000", "poly": [[0.4025, 0.01229], [0.41667, 0.10893], [0.41667, 0.13677], [0.2775, 0.13841], [0.2775, 0.01392]]},
  {"id": 32, "status": "available", "acres": 1.35, "sf": 58987, "dim": "158 x 372", "road": "Lakeview Avenue", "type": "Daylight", "features": "", "price": "$230,000", "poly": [[0.41458, 0.13841], [0.4175, 0.22359], [0.28042, 0.28092], [0.27792, 0.13595]]},
  {"id": 33, "status": "available", "acres": 1.33, "sf": 57896, "dim": "132 x 167", "road": "Lakeview Avenue", "type": "Daylight", "features": "Corner Lot (LA & HLC)", "price": "$250,000", "poly": [[0.28958, 0.27518], [0.28875, 0.40131], [0.35208, 0.38165], [0.42167, 0.32023], [0.41542, 0.22768]]},
  {"id": 34, "status": "available", "acres": 0.51, "sf": 22333, "dim": "133 x 168", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$220,000", "poly": [[0.21542, 0.28256], [0.215, 0.40541], [0.26333, 0.40786], [0.26542, 0.27928]]},
  {"id": 35, "status": "available", "acres": 0.51, "sf": 22338, "dim": "135 x 165", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$220,000", "poly": [[0.215, 0.28256], [0.16417, 0.27846], [0.16875, 0.40377], [0.21333, 0.40704]]},
  {"id": 36, "status": "available", "acres": 0.55, "sf": 24078, "dim": "141 x 170", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$220,000", "poly": [[0.16, 0.28829], [0.0975, 0.28665], [0.13875, 0.43079], [0.16375, 0.40704]]},
  {"id": 37, "status": "available", "acres": 1.01, "sf": 44115, "dim": "140 x 315", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "", "price": "$225,000", "poly": [[0.0975, 0.28665], [0.02792, 0.29075], [0.03042, 0.3579], [0.10958, 0.4783], [0.13583, 0.43079]]},
  {"id": 38, "status": "available", "acres": 1.01, "sf": 43998, "dim": "180 x 240", "road": "Hidden Lakes Crossing", "type": "Daylight", "features": "Cul-de-sac", "price": "$225,000", "poly": [[0.02792, 0.35954], [0.02792, 0.5733], [0.08833, 0.58313], [0.09583, 0.52007], [0.10792, 0.48075]]},
  {"id": 39, "status": "available", "acres": 1.05, "sf": 45790, "dim": "175 x 260", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Corner (HLC & HLC), Cul-de-sac", "price": "$255,000", "poly": [[0.03208, 0.63718], [0.09375, 0.63636], [0.09583, 0.72973], [0.10333, 0.76904], [0.03, 0.85012]]},
  {"id": 40, "status": "available", "acres": 1.02, "sf": 44487, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Premium Lot, Cul-de-sac", "price": "$255,000", "poly": [[0.03125, 0.85176], [0.02792, 0.99509], [0.05417, 0.99427], [0.125, 0.8231], [0.1025, 0.77477]]},
  {"id": 41, "status": "available", "acres": 1.03, "sf": 44941, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Premium Lot, Cul-de-sac", "price": "$255,000", "poly": [[0.125, 0.82883], [0.17, 0.86405], [0.16417, 0.99672], [0.05833, 0.99672]]},
  {"id": 42, "status": "available", "acres": 1.01, "sf": 44081, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Premium Lot, Lake View, Cul-de-sac", "price": "$270,000", "poly": [[0.17917, 0.86978], [0.16875, 0.99099], [0.29792, 0.98526], [0.2975, 0.96314], [0.21542, 0.86077], [0.20125, 0.87961]]},
  {"id": 43, "status": "available", "acres": 1.13, "sf": 49107, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Deluxe Lot, Dual Lake View, Woodland, Cul-de-sac", "price": "$325,000", "poly": [[0.21708, 0.81818], [0.21708, 0.85586], [0.29958, 0.95741], [0.32375, 0.88043], [0.27792, 0.73219]]},
  {"id": 44, "status": "available", "acres": 1.18, "sf": 51545, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Deluxe Lot, Cul-de-sac", "price": "$325,000", "poly": [[0.21625, 0.81654], [0.20542, 0.80098], [0.19, 0.79853], [0.18625, 0.61916], [0.26458, 0.62326], [0.27542, 0.72727]]},
  {"id": 45, "status": "available", "acres": 1.07, "sf": 46692, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Premium Lot, Lake View", "price": "$250,000", "poly": [[0.18917, 0.80098], [0.175, 0.819], [0.14375, 0.80508], [0.125, 0.7715], [0.11583, 0.7199], [0.11458, 0.62654], [0.18625, 0.62326]]},
  {"id": 46, "status": "available", "acres": 1.02, "sf": 44366, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Premium Lot", "price": "$250,000", "poly": [[0.20333, 0.61671], [0.11458, 0.61671], [0.11792, 0.54545], [0.13208, 0.49468], [0.15875, 0.47093], [0.2, 0.457]]},
  {"id": 47, "status": "available", "acres": 1, "sf": 43662, "dim": "", "road": "Hidden Lakes Court", "type": "Walkout", "features": "Premium Lot, Green Space", "price": "$275,000", "poly": [[0.205, 0.61507], [0.26458, 0.61916], [0.27542, 0.57002], [0.27958, 0.457], [0.20208, 0.45536]]},
  {"id": 48, "status": "available", "acres": 1.08, "sf": 47125, "dim": "136 x 348", "road": "Lakeview Avenue", "type": "Walkout", "features": "Premium, Corner Lot (LA & HLC)", "price": "$300,000", "poly": [[0.32208, 0.44636], [0.33083, 0.55201], [0.45667, 0.46683], [0.43542, 0.37756]]},
  {"id": 49, "status": "available", "acres": 1.04, "sf": 45091, "dim": "127 x 355", "road": "Lakeview Avenue", "type": "Walkout", "features": "Premium Lot, Lake View", "price": "$320,000", "poly": [[0.33208, 0.56183], [0.34625, 0.64865], [0.47375, 0.54791], [0.455, 0.46683]]},
  {"id": 50, "status": "available", "acres": 1.17, "sf": 50996, "dim": "135 x 375", "road": "Lakeview Avenue", "type": "Walkout", "features": "Deluxe Lot, Dual Lake & Wood View", "price": "$340,000", "poly": [[0.34708, 0.64701], [0.36708, 0.75594], [0.49292, 0.6249], [0.47292, 0.55201]]}
];


function lotView(l){ const f=(l.features||'').toLowerCase(); if(f.indexOf('lake')>-1) return 'Lake View'; if(f.indexOf('wood')>-1) return 'Wooded'; return 'Standard'; }
function statusLabel(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function statusText(s){ return s==='available' ? 'For Sale' : statusLabel(s); }

function initLotMap() {
    const panel = document.getElementById('lotDetailPanel');
    const panelClose = document.getElementById('panelClose');
    const sizeFilter = document.getElementById('lotSizeFilter');
    const viewFilter = document.getElementById('lotViewFilter');

    renderLotOverlay();
    updateLotStats();

    if (panelClose) panelClose.addEventListener('click', closeLotPanel);
    document.addEventListener('click', function(e){
        if (panel.classList.contains('active') && !panel.contains(e.target) && !e.target.closest('.lot')) closeLotPanel();
    });
    if (sizeFilter) sizeFilter.addEventListener('change', filterLots);
    if (viewFilter) viewFilter.addEventListener('change', filterLots);
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && panel.classList.contains('active')) closeLotPanel(); });
}

// Touch devices have no hover: a tap fires hover+click together. So on touch we
// show a tap-to-preview card (with a "View full details" button) instead of
// jumping straight into the detail panel.
const SUPPORTS_HOVER = !(window.matchMedia && window.matchMedia('(hover: none)').matches);

let lotTooltip = null;
function ensureTooltip(){
    if (lotTooltip) return lotTooltip;
    lotTooltip = document.createElement('div');
    lotTooltip.className = 'lot-tooltip';
    (document.querySelector('.lot-map-wrapper') || document.body).appendChild(lotTooltip);
    return lotTooltip;
}

function tooltipHTML(lot, withButton){
    return '<div class="lt-head"><span class="lt-num">Lot ' + lot.id + '</span>' +
        '<span class="lt-status ' + lot.status + '">' + statusText(lot.status) + '</span></div>' +
        '<div class="lt-row"><span>Size</span><b>' + lot.acres.toFixed(2) + ' ac &middot; ' + lot.sf.toLocaleString() + ' sf</b></div>' +
        (lot.features ? '<div class="lt-row"><span>Amenities</span><b>' + lot.features + '</b></div>' : '') +
        '<div class="lt-row"><span>Price</span><b>' + lot.price + '</b></div>' +
        (withButton
            ? '<button type="button" class="lt-btn" data-lot="' + lot.id + '">View full details</button>'
            : '<div class="lt-foot">Click for full details</div>');
}

const MAP_REMAP_PENDING = false; // new map image swapped in; hover zones hidden until lots are re-traced
function renderLotOverlay(){
    const svg = document.getElementById('lotOverlay');
    if (!svg) return;
    if (MAP_REMAP_PENDING) { svg.innerHTML=''; return; }
    const vb = (svg.getAttribute('viewBox') || '0 0 1200 800').split(/\s+/).map(Number);
    const W = vb[2] || 1200, H = vb[3] || 800;
    const NS = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';
    lotData.forEach(function(lot){
        if (!lot.poly || !lot.poly.length) return;
        const p = document.createElementNS(NS, 'polygon');
        p.setAttribute('points', lot.poly.map(function(pt){ return (pt[0]*W).toFixed(1)+','+(pt[1]*H).toFixed(1); }).join(' '));
        p.setAttribute('class', 'lot ' + lot.status);
        p.setAttribute('data-id', lot.id);
        if (SUPPORTS_HOVER) {
            p.addEventListener('mouseenter', function(e){ showTooltip(e, lot); });
            p.addEventListener('mousemove', moveTooltip);
            p.addEventListener('mouseleave', hideTooltip);
            p.addEventListener('click', function(e){ e.stopPropagation(); showLotInfo(lot.id); });
        } else {
            p.addEventListener('click', function(e){ e.stopPropagation(); showLotCard(lot, p); });
        }
        svg.appendChild(p);
    });

    // Dismiss the touch preview card when tapping elsewhere
    if (!SUPPORTS_HOVER && !renderLotOverlay._dismissBound) {
        document.addEventListener('click', function(e){
            if (lotTooltip && lotTooltip.style.display === 'block' &&
                !lotTooltip.contains(e.target) && !(e.target.closest && e.target.closest('.lot'))) {
                hideTooltip();
            }
        });
        renderLotOverlay._dismissBound = true;
    }
}

// Desktop: cursor-following tooltip
function showTooltip(e, lot){
    const t = ensureTooltip();
    t.className = 'lot-tooltip';
    t.innerHTML = tooltipHTML(lot, false);
    t.style.display = 'block';
    moveTooltip(e);
}
function moveTooltip(e){
    if (!lotTooltip) return;
    const wrap = document.querySelector('.lot-map-wrapper');
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const tw = lotTooltip.offsetWidth, th = lotTooltip.offsetHeight;
    let x = e.clientX - r.left + 14, y = e.clientY - r.top + 14;
    if (x + tw > r.width) x = e.clientX - r.left - tw - 14;
    if (y + th > r.height) y = e.clientY - r.top - th - 14;
    lotTooltip.style.left = Math.max(4, x) + 'px';
    lotTooltip.style.top = Math.max(4, y) + 'px';
}

// Touch: tap shows an anchored card with a button to open the full panel
function showLotCard(lot, polyEl){
    const t = ensureTooltip();
    t.className = 'lot-tooltip touch';
    t.innerHTML = tooltipHTML(lot, true);
    t.style.display = 'block';
    const wrap = document.querySelector('.lot-map-wrapper');
    const wr = wrap.getBoundingClientRect();
    const lr = polyEl.getBoundingClientRect();
    const tw = t.offsetWidth, th = t.offsetHeight;
    let x = (lr.left - wr.left) + (lr.width / 2) - (tw / 2);
    let y = (lr.top - wr.top) - th - 10;            // prefer above the lot
    if (y < 4) y = (lr.bottom - wr.top) + 10;        // not enough room → below
    x = Math.max(4, Math.min(x, wr.width - tw - 4));
    y = Math.max(4, Math.min(y, wr.height - th - 4));
    t.style.left = x + 'px';
    t.style.top = y + 'px';
    const btn = t.querySelector('.lt-btn');
    if (btn) btn.addEventListener('click', function(e){ e.stopPropagation(); hideTooltip(); showLotInfo(lot.id); });
}

function hideTooltip(){ if (lotTooltip) lotTooltip.style.display = 'none'; }

function showLotInfo(lotId) {
    const lot = lotData.find(function(l){ return l.id === lotId; });
    if (!lot) return;
    const panel = document.getElementById('lotDetailPanel');
    document.getElementById('lotNumber').textContent = lot.id;
    const st = document.getElementById('lotStatus');
    st.textContent = statusText(lot.status);
    st.className = 'lot-detail-status ' + lot.status;
    document.getElementById('lotSize').textContent = lot.acres.toFixed(2) + ' ac (' + lot.sf.toLocaleString() + ' sf)';
    document.getElementById('lotView').textContent = (lot.type === 'Daylight' ? 'Daylight' : 'Walk-Out') + (lotView(lot) !== 'Standard' ? ' · ' + lotView(lot) : '');
    document.getElementById('lotPrice').textContent = lot.price;
    const desc = [];
    if (lot.features) desc.push(lot.features + '.');
    desc.push('Located on ' + lot.road + '.');
    if (lot.dim) desc.push('Approx. dimensions ' + lot.dim + '.');
    desc.push(lot.type === 'Daylight' ? 'Daylight lot.' : 'Walk-out (W/O) lot.');
    document.getElementById('lotDescription').textContent = desc.join(' ');
    const btn = document.querySelector('.lot-inquiry-btn');
    if (btn) btn.setAttribute('data-lot', lot.id);
    panel.classList.add('active');
    hideTooltip();
}

function closeLotPanel() {
    const p = document.getElementById('lotDetailPanel');
    if (p) p.classList.remove('active');
}

function filterLots() {
    const sizeF = document.getElementById('lotSizeFilter').value;
    const viewF = document.getElementById('lotViewFilter').value;
    document.querySelectorAll('#lotOverlay .lot').forEach(function(el){
        const lot = lotData.find(function(l){ return l.id === parseInt(el.getAttribute('data-id'), 10); });
        if (!lot) return;
        let ok = true;
        if (sizeF === 'small') ok = ok && lot.acres < 1.0;
        else if (sizeF === 'medium') ok = ok && lot.acres >= 1.0 && lot.acres <= 1.5;
        else if (sizeF === 'large') ok = ok && lot.acres > 1.5;
        if (viewF === 'lake') ok = ok && lotView(lot) === 'Lake View';
        else if (viewF === 'woods') ok = ok && lotView(lot) === 'Wooded';
        el.classList.toggle('dimmed', !ok);
        el.classList.toggle('match', ok && (sizeF!=='all' || viewF!=='all'));
    });
}

function updateLotStats() {
    const a = document.getElementById('availableCount');
    const lv = document.getElementById('lakeViewCount');
    if (a) a.textContent = lotData.filter(function(l){ return l.status === 'available'; }).length;
    if (lv) lv.textContent = lotData.filter(function(l){ return lotView(l) === 'Lake View'; }).length;
}

/* =====================================================
   GALLERY
   ===================================================== */

function initGallery() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const panels = document.querySelectorAll('.gallery-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab + '-panel') {
                    panel.classList.add('active');
                }
            });
        });
    });

    // Gallery item click for lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-item-overlay span');
            openLightbox(img.src, caption ? caption.textContent : '');
        });
    });
}

/* =====================================================
   LIGHTBOX
   ===================================================== */

let currentLightboxIndex = 0;
const galleryImages = [];

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Collect all gallery images
    document.querySelectorAll('.gallery-item img').forEach((img, index) => {
        const caption = img.closest('.gallery-item').querySelector('.gallery-item-overlay span');
        galleryImages.push({
            src: img.src,
            caption: caption ? caption.textContent : ''
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    // Find current index
    currentLightboxIndex = galleryImages.findIndex(img => img.src === src);

    lightboxImage.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
        currentLightboxIndex = 0;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    lightboxImage.src = galleryImages[currentLightboxIndex].src;
    lightboxCaption.textContent = galleryImages[currentLightboxIndex].caption;
}

/* =====================================================
   CONTACT FORM
   ===================================================== */

function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    const RECIPIENT = 'hiddenlakesia@gmail.com';

    function showStatus(html, type) {
        if (!statusEl) { alert(html.replace(/<[^>]+>/g, '')); return; }
        statusEl.innerHTML = html;
        statusEl.className = 'form-status ' + (type || '');
        statusEl.style.display = 'block';
    }

    function showEmailFallback(p) {
        const subject = encodeURIComponent('Hidden Lakes inquiry — ' + p.firstName + ' ' + p.lastName);
        const body = encodeURIComponent(
            'Name: ' + p.firstName + ' ' + p.lastName + '\n' +
            'Email: ' + p.email + '\n' +
            'Phone: ' + (p.phone || '') + '\n' +
            'Interested in: ' + (p.interest || '') + '\n' +
            'Lot: ' + (p.lotInterest || '') + '\n\n' +
            (p.message || '')
        );
        showStatus(
            "We couldn't submit the form just now. Please email us directly at " +
            '<a href="mailto:' + RECIPIENT + '?subject=' + subject + '&body=' + body + '">' + RECIPIENT + '</a>' +
            " and we'll respond right away.",
            'error'
        );
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const payload = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            interest: document.getElementById('interest').value,
            lotInterest: document.getElementById('lotInterest').value.trim(),
            message: document.getElementById('message').value.trim(),
            updates: form.querySelector('input[name="updates"]').checked,
            _gotcha: (form.querySelector('input[name="_gotcha"]') || {}).value || ''
        };

        if (!payload.firstName || !payload.lastName || !payload.email) {
            showStatus('Please fill in your first name, last name, and email.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        showStatus('', '');
        if (statusEl) statusEl.style.display = 'none';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                form.reset();
                showStatus("Thank you! We've received your message and will be in touch soon.", 'success');
            } else {
                showEmailFallback(payload);
            }
        } catch (err) {
            showEmailFallback(payload);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Pre-fill lot interest from lot panel inquiry button
    document.querySelectorAll('.lot-inquiry-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lotId = this.getAttribute('data-lot');
            if (lotId) {
                document.getElementById('lotInterest').value = 'Lot ' + lotId;
                document.getElementById('interest').value = 'lot';
            }
            closeLotPanel();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */

function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.feature-card, .location-card, .section-header').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero (optional, subtle)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });
}

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
