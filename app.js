/**
 * Shubham Lad - Professional Developer Portfolio
 * Application Script & Interactive Controllers
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDynamicTyping();
  initParticleCanvas();
  initCounters();
  initCodeSnippets();
  initRoleTabs();
  initArchitectureSimulator();
  initSkillsFilter();
  initProjectModals();
  initDeveloperTerminal();
  initResumeModal();
  initContactSystem();
  initScrollSpyAndNav();
});

/* ==========================================================================
   1. THEME CONTROLLER & PERSISTENCE
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  const themeIcon = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('sl_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  // Toggle dropdown
  if (themeToggleBtn && themeDropdown) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.remove('show');
    });
  }

  // Theme option clicks
  themeOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      applyTheme(theme);
      if (themeDropdown) themeDropdown.classList.remove('show');
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sl_portfolio_theme', theme);

    // Update active dropdown item
    themeOptions.forEach(opt => {
      if (opt.getAttribute('data-set-theme') === theme) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // Update icon
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-sun';
      } else if (theme === 'midnight') {
        themeIcon.className = 'fa-solid fa-water';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }
}

/* ==========================================================================
   2. DYNAMIC HERO TYPING EFFECT
   ========================================================================== */
function initDynamicTyping() {
  const dynamicElement = document.getElementById('dynamicType');
  if (!dynamicElement) return;

  const phrases = [
    'scalable backend engines',
    'enterprise Laravel & CodeIgniter systems',
    'automated AWS S3 & SNS cloud pipelines',
    'fintech loan origination platforms',
    'multi-bank payment gateway APIs',
    'high-concurrency RESTful microservices'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      dynamicElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      dynamicElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new
    }

    setTimeout(typeLoop, typingSpeed);
  }

  setTimeout(typeLoop, 500);
}

/* ==========================================================================
   3. PARTICLE CANVAS BACKGROUND
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.65;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ==========================================================================
   4. METRICS COUNTER ANIMATIONS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) observer.observe(metricsSection);
}

/* ==========================================================================
   5. CODE SNIPPET TABS & COPY
   ========================================================================== */
function initCodeSnippets() {
  const codeTabs = document.querySelectorAll('.code-tab');
  const codeDisplay = document.getElementById('codeDisplay');
  const copySnippetBtn = document.getElementById('copySnippetBtn');

  const snippets = {
    aws: `// AWS Automated Tripwire & Notification Pipeline
class AwsTripwireService {
    public function dispatchTripwireReport(): array {
        // 1. Fetch & parse latest security audit report
        $report = TripwireParser::getLatestAuditReport();
        $formattedHtml = ReportFormatter::toHtml($report);
        
        // 2. Upload securely to Amazon S3
        $s3Key = "reports/tripwire/" . date('Y-m-d') . ".html";
        $s3Result = $this->s3Client->putObject([
            'Bucket' => config('aws.s3_bucket'),
            'Key'    => $s3Key,
            'Body'   => $formattedHtml,
            'ContentType' => 'text/html'
        ]);
        
        // 3. Generate CloudFront CDN Distribution URL
        $cdnUrl = config('aws.cloudfront_domain') . "/" . $s3Key;
        
        // 4. Broadcast instant multi-recipient alerts via AWS SNS
        $snsMessage = "Daily Tripwire Audit ready: {$cdnUrl}";
        $this->snsClient->publish([
            'TopicArn' => config('aws.sns_topic_arn'),
            'Message'  => $snsMessage,
            'Subject'  => 'Security Report - ' . date('d M Y')
        ]);
        
        return ['status' => 'SUCCESS', 'cdn_url' => $cdnUrl];
    }
}`,
    los: `// Loan Originating System (LOS) - Underwriting & AA Verification
namespace App\\Http\\Controllers\\Api;

use App\\Services\\AccountAggregatorService;
use App\\Services\\GoogleSheetsSyncService;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class LosApplicationController extends BaseController {
    public function processApplication(Request $request): JsonResponse {
        $validated = $request->validate([
            'borrower_id' => 'required|uuid',
            'loan_amount' => 'required|numeric|min:10000',
            'consent_id'  => 'required|string'
        ]);

        // 1. Retrieve Financial Statement via Account Aggregator API
        $aaData = $this->aaService->fetchVerifiedBankStatement($validated['consent_id']);
        $creditScore = LoanRuleEngine::calculateEligibility($aaData, $validated['loan_amount']);

        // 2. Persist Application state with ACID transaction
        $loanApp = LoanApplication::create([
            'borrower_id'  => $validated['borrower_id'],
            'amount'       => $validated['loan_amount'],
            'credit_score' => $creditScore,
            'status'       => $creditScore >= 700 ? 'PRE_APPROVED' : 'MANUAL_REVIEW'
        ]);

        // 3. Sync to Google Cloud Sheets API for executive audit
        GoogleSheetsSyncService::appendRecord($loanApp->toArray());

        return response()->json([
            'status'  => 'SUCCESS',
            'app_id'  => $loanApp->id,
            'decision'=> $loanApp->status
        ], 201);
    }
}`,
    payment: `# Multi-Bank Payment Gateway & Disbursement Service (Django)
import hashlib, hmac, json, requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['POST'])
def process_bank_disbursement(request):
    """
    Handles secure disbursement via NSDL / Fino / Airtel Gateway with Idempotency
    """
    payload = request.data
    tx_ref = payload.get('transaction_ref')
    gateway = payload.get('gateway', 'NSDL') # NSDL, FINO, AIRTEL
    
    # 1. Verify Idempotency in Cache/DB
    if TransactionLedger.objects.filter(ref=tx_ref).exists():
        return Response({"error": "Duplicate transaction detected"}, status=409)

    # 2. Generate secure Checksum Signature
    raw_payload = f"{tx_ref}|{payload['amount']}|{payload['account_number']}"
    signature = hmac.new(
        settings.PAYMENT_SECRET_KEY.encode('utf-8'),
        raw_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    # 3. Dispatch to Financial Banking API
    endpoint = settings.GATEWAY_ENDPOINTS.get(gateway)
    headers = {'X-Auth-Signature': signature, 'Content-Type': 'application/json'}
    
    response = requests.post(endpoint, json=payload, headers=headers, timeout=10)
    res_data = response.json()
    
    # 4. Record Double-entry Transaction in Ledger
    TransactionLedger.record_success(tx_ref, gateway, payload['amount'], res_data)
    
    return Response({"status": "SUCCESS", "bank_utr": res_data.get('utr_number')})`
  };

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const fileKey = tab.getAttribute('data-file');
      if (snippets[fileKey] && codeDisplay) {
        codeDisplay.innerHTML = `<code class="language-${fileKey === 'payment' ? 'python' : 'php'}">${escapeHtml(snippets[fileKey])}</code>`;
      }
    });
  });

  if (copySnippetBtn) {
    copySnippetBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.code-tab.active');
      const fileKey = activeTab ? activeTab.getAttribute('data-file') : 'aws';
      copyToClipboard(snippets[fileKey], 'Code snippet copied to clipboard!');
    });
  }
}

/* ==========================================================================
   6. EXPERIENCE TIMELINE TABS
   ========================================================================== */
function initRoleTabs() {
  const roleTabBtns = document.querySelectorAll('.role-tab-btn');
  const roleTabPanes = document.querySelectorAll('.role-tab-pane');

  roleTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      roleTabBtns.forEach(b => b.classList.remove('active'));
      roleTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE ARCHITECTURE SIMULATOR
   ========================================================================== */
function initArchitectureSimulator() {
  const simTabs = document.querySelectorAll('.sim-tab');
  const pipelines = document.querySelectorAll('.pipeline-diagram');
  const runSimBtn = document.getElementById('runSimBtn');
  const resetSimBtn = document.getElementById('resetSimBtn');

  // Switch between AWS Tripwire and Fintech LOS/Payment pipelines
  simTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const pipelineKey = tab.getAttribute('data-pipeline');

      simTabs.forEach(t => t.classList.remove('active'));
      pipelines.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPipeline = document.getElementById(`pipeline-${pipelineKey}`);
      if (targetPipeline) targetPipeline.classList.add('active');

      resetSimulation();
    });
  });

  let simulationRunning = false;
  let simTimeoutId = null;

  if (runSimBtn) {
    runSimBtn.addEventListener('click', () => {
      if (simulationRunning) return;
      runActiveSimulation();
    });
  }

  if (resetSimBtn) {
    resetSimBtn.addEventListener('click', () => {
      resetSimulation();
    });
  }

  function runActiveSimulation() {
    const activeTab = document.querySelector('.sim-tab.active');
    const pipelineKey = activeTab ? activeTab.getAttribute('data-pipeline') : 'aws-tripwire';

    if (pipelineKey === 'aws-tripwire') {
      runAwsTripwireSimulation();
    } else {
      runFintechPaymentSimulation();
    }
  }

  function runAwsTripwireSimulation() {
    simulationRunning = true;
    const nodes = [
      document.getElementById('node-1'),
      document.getElementById('node-2'),
      document.getElementById('node-3'),
      document.getElementById('node-4'),
      document.getElementById('node-5')
    ];
    const connectors = document.querySelectorAll('#pipeline-aws-tripwire .arch-connector');
    const status = document.getElementById('simStatus');
    const logs = document.getElementById('simLogs');

    // Clear previous state
    nodes.forEach(n => n && (n.className = 'arch-node'));
    connectors.forEach(c => c && c.classList.remove('flowing'));
    if (logs) logs.innerHTML = '';

    const steps = [
      {
        nodeIndex: 0,
        statusText: 'STEP 1: Triggering Cron Job...',
        logText: '[00:00:01] CRON_TRIGGER: Hourly security audit initiated. Scanning /var/log/tripwire for latest .twr file...'
      },
      {
        nodeIndex: 1,
        statusText: 'STEP 2: PHP CLI Parsing Report...',
        logText: '[00:00:02] PHP_PARSER: Found file "tripwire_audit_2026.twr". Parsing raw binary output into sanitized HTML tables and JSON diffs.'
      },
      {
        nodeIndex: 2,
        statusText: 'STEP 3: Uploading to Amazon S3...',
        logText: '[00:00:03] AWS_S3_SDK: PutObjectCommand -> bucket="ftcash-security-audit-vault", key="reports/2026-08/tripwire-0816.html", SSE="AES256" [200 OK]'
      },
      {
        nodeIndex: 3,
        statusText: 'STEP 4: Generating CloudFront CDN URL...',
        logText: '[00:00:04] AWS_CLOUDFRONT: Generated edge distribution link: https://d111111abcdef8.cloudfront.net/reports/2026-08/tripwire-0816.html'
      },
      {
        nodeIndex: 4,
        statusText: 'STEP 5: Broadcasting AWS SNS Notifications...',
        logText: '[00:00:05] AWS_SNS: Publish -> TopicArn="arn:aws:sns:ap-south-1:123456789012:security-alerts". Dispatched email notifications to 12 security stakeholders via AWS CLI. SUCCESS!'
      }
    ];

    let currentStep = 0;

    function executeStep() {
      if (currentStep < steps.length) {
        const step = steps[currentStep];

        // Mark previous nodes completed
        for (let i = 0; i < currentStep; i++) {
          if (nodes[i]) nodes[i].className = 'arch-node completed-node';
          if (connectors[i]) connectors[i].classList.remove('flowing');
        }

        // Active node
        if (nodes[step.nodeIndex]) {
          nodes[step.nodeIndex].className = 'arch-node active-node';
        }
        if (connectors[step.nodeIndex]) {
          connectors[step.nodeIndex].classList.add('flowing');
        }

        if (status) status.textContent = step.statusText;
        if (logs) {
          const logDiv = document.createElement('div');
          logDiv.className = 'log-line text-accent';
          logDiv.textContent = step.logText;
          logs.appendChild(logDiv);
          logs.scrollTop = logs.scrollHeight;
        }

        currentStep++;
        simTimeoutId = setTimeout(executeStep, 1100);
      } else {
        // Complete
        nodes.forEach(n => n && (n.className = 'arch-node completed-node'));
        connectors.forEach(c => c && c.classList.remove('flowing'));
        if (status) status.textContent = 'SIMULATION COMPLETE - AWS Pipeline Executed Successfully (100% Reliable)';
        simulationRunning = false;
      }
    }

    executeStep();
  }

  function runFintechPaymentSimulation() {
    simulationRunning = true;
    const nodes = [
      document.getElementById('flow-node-1'),
      document.getElementById('flow-node-2'),
      document.getElementById('flow-node-3'),
      document.getElementById('flow-node-4'),
      document.getElementById('flow-node-5')
    ];
    const connectors = document.querySelectorAll('#pipeline-los-lms .arch-connector');
    const status = document.getElementById('flowSimStatus');
    const logs = document.getElementById('flowSimLogs');

    nodes.forEach(n => n && (n.className = 'arch-node'));
    connectors.forEach(c => c && c.classList.remove('flowing'));
    if (logs) logs.innerHTML = '';

    const steps = [
      {
        nodeIndex: 0,
        statusText: 'STEP 1: Inbound Borrower Application...',
        logText: '[00:00:01] CLIENT_REQUEST: Received ₹2,50,000 working capital loan request via ftcash Android App (v5.1).'
      },
      {
        nodeIndex: 1,
        statusText: 'STEP 2: Laravel LOS Underwriting...',
        logText: '[00:00:02] LARAVEL_LOS: Validated payload, applied risk rule engine, verified KYC Aadhaar/PAN, created loan entity #LOS-9482.'
      },
      {
        nodeIndex: 2,
        statusText: 'STEP 3: Account Aggregator Statement Pull...',
        logText: '[00:00:03] AA_API: Pulled 12-month verified net-banking transactions; synced metadata via Google Cloud PHP Sheet API.'
      },
      {
        nodeIndex: 3,
        statusText: 'STEP 4: Django Multi-Bank Disbursement...',
        logText: '[00:00:04] DJANGO_PAYMENT: Dispatched payout to Fino Payments Bank / NSDL Gateway with HMAC-SHA256 signature [UTR: FT20260816991823].'
      },
      {
        nodeIndex: 4,
        statusText: 'STEP 5: LMS & Database Ledger Sync...',
        logText: '[00:00:05] LMS_CODEIGNITER: Updated borrower ledger, triggered push notification and converted lead status to DISBURSED. Workflow finished!'
      }
    ];

    let currentStep = 0;

    function executeStep() {
      if (currentStep < steps.length) {
        const step = steps[currentStep];

        for (let i = 0; i < currentStep; i++) {
          if (nodes[i]) nodes[i].className = 'arch-node completed-node';
          if (connectors[i]) connectors[i].classList.remove('flowing');
        }

        if (nodes[step.nodeIndex]) {
          nodes[step.nodeIndex].className = 'arch-node active-node';
        }
        if (connectors[step.nodeIndex]) {
          connectors[step.nodeIndex].classList.add('flowing');
        }

        if (status) status.textContent = step.statusText;
        if (logs) {
          const logDiv = document.createElement('div');
          logDiv.className = 'log-line text-success';
          logDiv.textContent = step.logText;
          logs.appendChild(logDiv);
          logs.scrollTop = logs.scrollHeight;
        }

        currentStep++;
        simTimeoutId = setTimeout(executeStep, 1100);
      } else {
        nodes.forEach(n => n && (n.className = 'arch-node completed-node'));
        connectors.forEach(c => c && c.classList.remove('flowing'));
        if (status) status.textContent = 'SIMULATION COMPLETE - Disbursement and Ledger Updated Successfully';
        simulationRunning = false;
      }
    }

    executeStep();
  }

  function resetSimulation() {
    if (simTimeoutId) clearTimeout(simTimeoutId);
    simulationRunning = false;

    const allNodes = document.querySelectorAll('.arch-node');
    const allConnectors = document.querySelectorAll('.arch-connector');
    allNodes.forEach(n => (n.className = 'arch-node'));
    allConnectors.forEach(c => c.classList.remove('flowing'));

    const status1 = document.getElementById('simStatus');
    const logs1 = document.getElementById('simLogs');
    if (status1) status1.textContent = 'IDLE - Click "Run Simulation" to test';
    if (logs1) {
      logs1.innerHTML = `
        <div class="log-line text-muted">[00:00:00] Pipeline initialized: AWS S3 + SNS Tripwire Notification Subsystem</div>
        <div class="log-line text-muted">[00:00:00] Ready to trigger automated .twr log ingestion and CloudFront URL broadcast.</div>
      `;
    }

    const status2 = document.getElementById('flowSimStatus');
    const logs2 = document.getElementById('flowSimLogs');
    if (status2) status2.textContent = 'IDLE - Click "Run Simulation" to test';
    if (logs2) {
      logs2.innerHTML = `
        <div class="log-line text-muted">[00:00:00] Financial routing initialized: Loan Origination to Multi-Bank Disbursement</div>
        <div class="log-line text-muted">[00:00:00] Endpoints ready: NSDL, Fino Bank, Airtel Payments Bank with Idempotency.</div>
      `;
    }
  }

  // Node click inspection
  const allNodes = document.querySelectorAll('.arch-node');
  allNodes.forEach(node => {
    node.addEventListener('click', () => {
      const title = node.querySelector('.node-title')?.textContent || 'Node';
      const desc = node.querySelector('.node-desc')?.textContent || '';
      const badge = node.querySelector('.node-badge')?.textContent || '';
      showToast(`${title} (${badge}): ${desc}`, 'info');
    });
  });
}

/* ==========================================================================
   8. SKILLS MATRIX FILTER & LIVE SEARCH
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('#skillsFilterBtns .filter-btn');
  const skillCards = document.querySelectorAll('#skillsGrid .skill-card');
  const searchInput = document.getElementById('skillsSearchInput');

  let currentCategory = 'all';
  let searchQuery = '';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applySkillsFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applySkillsFilter();
    });
  }

  function applySkillsFilter() {
    skillCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = (!searchQuery || cardText.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

/* ==========================================================================
   9. PROJECT MODAL SYSTEM
   ========================================================================== */
function initProjectModals() {
  const projectModal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeProjectModalBtn');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalSubtitle = document.getElementById('modalProjectSubtitle');
  const modalIcon = document.getElementById('modalProjectIcon');
  const modalBody = document.getElementById('modalProjectBody');
  const openButtons = document.querySelectorAll('.open-project-modal-btn');

  const projectDetails = {
    los: {
      title: 'Loan Originating System (LOS Dashboard)',
      subtitle: 'Nomisma Mobile Solutions (ftcash) • Laravel & MySQL Enterprise System',
      icon: '<i class="fa-brands fa-laravel text-danger"></i>',
      content: `
        <div class="modal-detail-section">
          <h4><i class="fa-solid fa-layer-group text-accent"></i> System Overview & Business Impact</h4>
          <p>The LOS Dashboard is the primary operational nerve center for ftcash lending operations. It automates applicant intake, business document OCR validation, real-time credit policy checks, and disbursal approvals for thousands of merchant borrowers across India.</p>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-gears text-accent"></i> Key Technical Responsibilities</h4>
          <ul class="key-points" style="margin-top: 0.75rem;">
            <li><strong>Laravel Modular MVC Architecture:</strong> Engineered scalable controllers, repositories, and custom validation form requests with strict type-hinting in PHP 8.</li>
            <li><strong>Account Aggregator Integration:</strong> Built secure client connectors to RBI-licensed Account Aggregators, fetching machine-readable bank financial statements with user consent.</li>
            <li><strong>Google Cloud PHP Sheet API:</strong> Developed automated scheduled synchronization to push live lending metrics and risk assessment reports to Google Sheets for CXO visibility.</li>
            <li><strong>Database Optimization:</strong> Crafted composite MySQL indexes and optimized complex SQL queries with Eloquent eager loading, cutting query times by 65%.</li>
          </ul>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-code text-accent"></i> Technologies Used</h4>
          <div class="tech-tags" style="margin-top: 0.75rem;">
            <span>PHP 8</span><span>Laravel</span><span>MySQL</span><span>Account Aggregator API</span><span>Google Cloud Sheet API</span><span>RESTful API</span><span>GitLab</span>
          </div>
        </div>
      `
    },
    tripwire: {
      title: 'AWS Automated Tripwire S3 & SNS Notification Engine',
      subtitle: 'Nomisma Mobile Solutions (ftcash) • Cloud Infrastructure Automation',
      icon: '<i class="fa-brands fa-aws text-warning"></i>',
      content: `
        <div class="modal-detail-section">
          <h4><i class="fa-solid fa-cloud text-accent"></i> Automated Security Architecture</h4>
          <p>Built a zero-touch, automated audit log pipeline that eliminates manual security reporting. The system periodically extracts Tripwire security compliance reports, transforms them into interactive formatted web documents, archives them in Amazon S3, and broadcasts instant notifications via AWS SNS.</p>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-network-wired text-accent"></i> Pipeline Flow & Engineering Details</h4>
          <ul class="key-points" style="margin-top: 0.75rem;">
            <li><strong>CLI File Parser:</strong> Custom PHP CLI script dynamically identifies and parses the latest <code>.twr</code> (Tripwire) report file, extracting modified files, access violations, and system integrity metrics.</li>
            <li><strong>Amazon S3 Bucket Storage:</strong> Uploads formatted HTML/JSON reports to Amazon S3 buckets with server-side encryption (AES-256) and lifecycle storage policies.</li>
            <li><strong>CloudFront CDN Links:</strong> Generates secure CloudFront distribution URLs ensuring authorized internal stakeholders access reports with ultra-low latency.</li>
            <li><strong>AWS SNS & CLI Broadcasts:</strong> Orchestrates email broadcasts via AWS SNS topics to security engineering teams, utilizing AWS CLI and AWS PHP SDK.</li>
          </ul>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-code text-accent"></i> Technologies Used</h4>
          <div class="tech-tags" style="margin-top: 0.75rem;">
            <span>Amazon S3</span><span>AWS SNS</span><span>Amazon CloudFront</span><span>AWS CLI</span><span>PHP CLI</span><span>Tripwire (.twr)</span><span>Cron Automation</span>
          </div>
        </div>
      `
    },
    lms: {
      title: 'The Lead Management System (LMS Dashboard)',
      subtitle: 'Nomisma Mobile Solutions (ftcash) • CodeIgniter & High Concurrency',
      icon: '<i class="fa-solid fa-fire text-danger"></i>',
      content: `
        <div class="modal-detail-section">
          <h4><i class="fa-solid fa-bullseye text-accent"></i> Platform Purpose & Scale</h4>
          <p>Engineered and maintained ftcash's high-capacity Lead Management System (LMS) built with CodeIgniter. LMS receives leads from merchant applications, referral networks, web portals, and field sales teams, automatically routing them to appropriate loan officers.</p>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-bolt text-accent"></i> Engineering Highlights</h4>
          <ul class="key-points" style="margin-top: 0.75rem;">
            <li><strong>High-Speed CodeIgniter Routing:</strong> Optimized lightweight CodeIgniter controllers and query builders to handle high request volume with low server memory footprint.</li>
            <li><strong>Intelligent Lead Allocation:</strong> Built algorithmic lead assignment rules factoring agent workload, geo-location proximity, and applicant credit category.</li>
            <li><strong>Interactive UI with AJAX:</strong> Developed dynamic data tables with instant multi-facet filtering, sorting, and bulk action triggers without full-page reloads.</li>
          </ul>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-code text-accent"></i> Technologies Used</h4>
          <div class="tech-tags" style="margin-top: 0.75rem;">
            <span>CodeIgniter</span><span>Core PHP</span><span>MySQL</span><span>jQuery</span><span>AJAX</span><span>Bootstrap</span><span>JSON</span>
          </div>
        </div>
      `
    },
    payments: {
      title: 'Multi-Bank Fintech Payment Gateway Aggregator',
      subtitle: 'Nomisma Mobile Solutions (ftcash) • Python, Django & Bank Gateways',
      icon: '<i class="fa-brands fa-python text-accent"></i>',
      content: `
        <div class="modal-detail-section">
          <h4><i class="fa-solid fa-building-columns text-accent"></i> High-Security Financial Integrations</h4>
          <p>Developed and integrated mission-critical payment services connecting ftcash lending systems with banking institutions and payment gateways including NSDL, Fino Payments Bank, and Airtel Payments Bank.</p>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-shield-halved text-accent"></i> Security & Reliability Features</h4>
          <ul class="key-points" style="margin-top: 0.75rem;">
            <li><strong>Python (Django) Microservice:</strong> Created dedicated endpoints for automated loan payouts, IMPS/NEFT disbursement triggers, and automated status polling.</li>
            <li><strong>Checksum Validation & Signatures:</strong> Implemented cryptographic HMAC-SHA256 signature generation and validation to safeguard transaction integrity.</li>
            <li><strong>Idempotency & Reconciliation:</strong> Engineered duplicate transaction prevention with Redis/database locking mechanisms and double-entry ledger bookkeeping.</li>
          </ul>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-code text-accent"></i> Technologies Used</h4>
          <div class="tech-tags" style="margin-top: 0.75rem;">
            <span>Python</span><span>Django</span><span>NSDL API</span><span>Fino Bank API</span><span>Airtel Payments Bank</span><span>REST Webhooks</span><span>Security Checksums</span>
          </div>
        </div>
      `
    },
    'android-api': {
      title: 'ftcash Android Mobile Application REST API Suite',
      subtitle: 'Nomisma Mobile Solutions (ftcash) • Laravel & CodeIgniter REST Endpoints',
      icon: '<i class="fa-solid fa-mobile-screen text-accent"></i>',
      content: `
        <div class="modal-detail-section">
          <h4><i class="fa-solid fa-mobile text-accent"></i> Mobile Backend Architecture</h4>
          <p>Architected, published, and maintained low-latency RESTful APIs supporting ftcash Android apps used by merchant partners and internal field executives.</p>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-wrench text-accent"></i> Core Features</h4>
          <ul class="key-points" style="margin-top: 0.75rem;">
            <li><strong>High-Speed JSON Payloads:</strong> Designed lightweight, compressed JSON responses optimized for field conditions with variable mobile connectivity.</li>
            <li><strong>Security & Authentication:</strong> Implemented secure token-based authorization (JWT), session expiration, and encrypted request payloads.</li>
            <li><strong>API Versioning & Postman Collections:</strong> Maintained versioned endpoints (v1/v2/v3) and comprehensive Postman documentation for cross-functional collaboration.</li>
          </ul>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-code text-accent"></i> Technologies Used</h4>
          <div class="tech-tags" style="margin-top: 0.75rem;">
            <span>Laravel</span><span>CodeIgniter</span><span>RESTful API</span><span>JWT Token</span><span>JSON / XML</span><span>Postman</span>
          </div>
        </div>
      `
    },
    'ftcash-web': {
      title: 'ftcash.com Official Corporate & Merchant Platform',
      subtitle: 'Nomisma Mobile Solutions (ftcash) • Vue.js & Modern Web Frontend',
      icon: '<i class="fa-brands fa-vuejs text-success"></i>',
      content: `
        <div class="modal-detail-section">
          <h4><i class="fa-solid fa-globe text-accent"></i> Web Platform Modernization</h4>
          <p>Contributed to frontend development and enhancements for ftcash's official corporate and merchant website (<a href="https://ftcash.com" target="_blank" rel="noopener noreferrer" class="link">ftcash.com <i class="fa-solid fa-arrow-up-right-from-square"></i></a>).</p>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-palette text-accent"></i> Key Contributions</h4>
          <ul class="key-points" style="margin-top: 0.75rem;">
            <li><strong>Vue.js Components:</strong> Developed interactive loan eligibility calculators, merchant onboarding wizards, and reactive form components.</li>
            <li><strong>Mobile-First Responsive Design:</strong> Crafted pixel-perfect layouts compatible with all modern desktop and mobile browsers.</li>
            <li><strong>Agile Collaboration:</strong> Active participant in sprint planning, code reviews, and Git release cycles within an agile team.</li>
          </ul>
        </div>

        <div class="modal-detail-section" style="margin-top: 1.5rem;">
          <h4><i class="fa-solid fa-code text-accent"></i> Technologies Used</h4>
          <div class="tech-tags" style="margin-top: 0.75rem;">
            <span>Vue.js</span><span>JavaScript ES6</span><span>HTML5</span><span>CSS3</span><span>GitLab</span><span>Agile Scrum</span>
          </div>
        </div>
      `
    }
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      const project = projectDetails[projectKey];

      if (project && projectModal) {
        modalTitle.textContent = project.title;
        modalSubtitle.textContent = project.subtitle;
        modalIcon.innerHTML = project.icon;
        modalBody.innerHTML = project.content;

        projectModal.classList.add('open');
        projectModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (closeBtn && projectModal) {
    closeBtn.addEventListener('click', () => {
      projectModal.classList.remove('open');
      projectModal.setAttribute('aria-hidden', 'true');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

/* ==========================================================================
   10. INTERACTIVE DEVELOPER CLI TERMINAL
   ========================================================================== */
function initDeveloperTerminal() {
  const termInput = document.getElementById('termInput');
  const termHistory = document.getElementById('termHistory');
  const termScreen = document.getElementById('terminalScreen');
  const termHelpBtn = document.getElementById('termHelpBtn');
  const termClearBtn = document.getElementById('termClearBtn');
  const termChips = document.querySelectorAll('.term-chip');

  if (!termInput || !termHistory) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: `Available CLI Commands:
  • whoami          - Display Shubham Lad's developer profile summary
  • skills          - List all backend, cloud, database & frontend skills
  • exp             - View detailed 4+ years professional work history
  • projects        - View enterprise systems built at ftcash
  • aws-pipeline    - Summary of AWS S3 + SNS Tripwire automated pipeline
  • education       - Academic background (B.Sc IT, Diploma, HSC)
  • contact         - Direct email, phone, location, and LinkedIn details
  • resume          - Open formatted printable PDF resume modal
  • theme <mode>    - Switch theme (e.g. 'theme dark', 'theme midnight', 'theme light')
  • clear           - Clear terminal output
  • date            - Display current date and time`,

    whoami: `Shubham Lad - SOFTWARE DEVELOPER
--------------------------------------------------
Experience : 4+ Years (Dec 2021 – Present)
Current Org: Nomisma Mobile Solutions Pvt. Ltd (ftcash)
Location   : Mumbai - 400072, Maharashtra, India
Expertise  : PHP (Laravel, CodeIgniter), AWS (S3, SNS), Python/Django, REST APIs, MySQL
Summary    : Backend specialist powering high-volume Loan Origination Systems (LOS) & Lead Management (LMS).`,

    skills: `Technical Skills Matrix:
--------------------------------------------------
[Backend]    : Core PHP (4+ yrs), Laravel (4+ yrs), CodeIgniter (4+ yrs), Python/Django
[Cloud]      : AWS S3, AWS SNS, Amazon CloudFront, AWS CLI, Google Cloud PHP Sheet API
[Databases]  : MySQL (Query Tuning, Indexing, ACID), SQLite, MongoDB (Basic)
[APIs/Web]   : RESTful APIs, Account Aggregator APIs, NSDL/Fino/Airtel Payment Gateways
[Frontend]   : Vue.js, JavaScript (ES6+), jQuery, AJAX, HTML5, CSS3, Bootstrap
[Tools]      : Git, GitLab, GitHub, Postman, Linux CLI, Agile / Scrum`,

    experience: `Professional Experience:
--------------------------------------------------
1. Nomisma Mobile Solutions Pvt. Ltd (ftcash)
   Role: Software Developer | Dec 2021 – Present (4+ Years)
   - Built and scaled LOS Dashboard (Laravel) with Account Aggregator & GCloud Sheet API.
   - Maintained LMS Dashboard (CodeIgniter) handling high-volume lead ingestion.
   - Built AWS S3 + CloudFront + SNS Tripwire security report notification engine.
   - Developed payment APIs with Python (Django) for NSDL, Fino Bank, Airtel Payments Bank.
   - Engineered REST APIs for ftcash Android mobile apps and contributed to Vue.js ftcash.com.

2. Nomisma Mobile Solutions Pvt. Ltd (ftcash)
   Role: Software Developer Intern | Sep 2021 – Nov 2021 (3 Months)
   - Mastered Core PHP, Python, JavaScript, Laravel, CodeIgniter, Bootstrap, and MySQL.`,

    exp: null, // aliased to experience

    projects: `Enterprise Projects & Systems:
--------------------------------------------------
1. Loan Originating System (LOS Dashboard) - Laravel, MySQL, Account Aggregator API
2. AWS Automated Tripwire S3 & SNS Notification Engine - AWS S3, SNS, CloudFront, CLI
3. The Lead Management System (LMS Dashboard) - CodeIgniter, jQuery, AJAX
4. Multi-Bank Fintech Payment Aggregator - Python/Django, NSDL, Fino Bank, Airtel Bank
5. ftcash Android Mobile REST API Suite - Laravel, REST, JWT, Low Latency
6. ftcash.com Corporate Web Platform - Vue.js, Responsive Frontend`,

    'aws-pipeline': `AWS Automated Tripwire S3 & SNS Notification Architecture:
--------------------------------------------------
[1] Trigger    : Automated daily/hourly Cron job initiates scan.
[2] PHP Parser : Extracts latest .twr file and parses raw logs into clean HTML/JSON.
[3] Amazon S3  : Uploads securely with server-side encryption (AES-256).
[4] CloudFront : Generates CDN distribution tokenized URLs for instant access.
[5] AWS SNS    : Dispatches email alerts to security team via AWS CLI and SNS Topics.`,

    education: `Academic Background:
--------------------------------------------------
• Bachelor of Information Technology (B.Sc IT) - University of Mumbai (2022 - 2025)
• Diploma in Electrical Engineering - Government Polytechnic Mumbai (2018 - 2021)
• Higher Secondary Certificate (HSC) - D.G. Ruparel College (2016 - 2018)
• Secondary School Certificate (SSC) - Navhind Madhyamik Vidyalay | Maharashtra`,

    contact: `Contact & Connect:
--------------------------------------------------
• Email    : shubhamlad113@gmail.com
• Phone    : +91 8450937429
• Location : Mumbai - 400072, Maharashtra, India
• LinkedIn : https://www.linkedin.com/in/shubham-lad-7aa910227/`,

    resume: () => {
      openResumeModal();
      return 'Opening formatted resume modal...';
    },

    date: () => new Date().toLocaleString(),

    clear: () => {
      termHistory.innerHTML = '';
      return '';
    }
  };

  commands.exp = commands.experience;

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawInput = termInput.value.trim();
      if (!rawInput) return;

      commandHistory.push(rawInput);
      historyIndex = commandHistory.length;

      executeCommand(rawInput);
      termInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        termInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        termInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        termInput.value = '';
      }
    }
  });

  function executeCommand(inputStr) {
    const parts = inputStr.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Render executed prompt
    const entry = document.createElement('div');
    entry.className = 'term-history-entry';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-executed-cmd';
    cmdLine.innerHTML = `<span class="term-user">shubham</span><span class="term-at">@</span><span class="term-host">backend</span>:<span class="term-path">~</span><span class="term-symbol">$</span> ${escapeHtml(inputStr)}`;
    entry.appendChild(cmdLine);

    let output = '';

    if (cmd === 'theme') {
      const targetTheme = args[0]?.toLowerCase();
      if (['dark', 'midnight', 'light'].includes(targetTheme)) {
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('sl_portfolio_theme', targetTheme);
        output = `Theme switched to: ${targetTheme}`;
      } else {
        output = `Usage: theme <dark | midnight | light>`;
      }
    } else if (commands[cmd] !== undefined) {
      if (typeof commands[cmd] === 'function') {
        output = commands[cmd]();
      } else {
        output = commands[cmd];
      }
    } else {
      output = `command not found: "${cmd}". Type 'help' for available commands.`;
    }

    if (cmd !== 'clear') {
      const resLine = document.createElement('div');
      resLine.className = 'term-response';
      resLine.textContent = output;
      entry.appendChild(resLine);
      termHistory.appendChild(entry);
    }

    if (termScreen) termScreen.scrollTop = termScreen.scrollHeight;
  }

  // Quick Chips
  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        termInput.value = cmd;
        executeCommand(cmd);
        termInput.value = '';
      }
    });
  });

  if (termHelpBtn) {
    termHelpBtn.addEventListener('click', () => {
      executeCommand('help');
    });
  }

  if (termClearBtn) {
    termClearBtn.addEventListener('click', () => {
      executeCommand('clear');
    });
  }
}

/* ==========================================================================
   11. RESUME MODAL & PRINT CONTROLLER
   ========================================================================== */
function initResumeModal() {
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const contactResumeBtn = document.getElementById('contactResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  if (viewResumeBtn) viewResumeBtn.addEventListener('click', openResumeModal);
  if (contactResumeBtn) contactResumeBtn.addEventListener('click', openResumeModal);

  if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', closeResumeModal);
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Global ESC key listener to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResumeModal();
      const projectModal = document.getElementById('projectModal');
      if (projectModal) {
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
      }
    }
  });
}

function openResumeModal() {
  const resumeModal = document.getElementById('resumeModal');
  if (resumeModal) {
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
  }
}

function closeResumeModal() {
  const resumeModal = document.getElementById('resumeModal');
  if (resumeModal) {
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
  }
}

/* ==========================================================================
   12. CONTACT SYSTEM & COPY HELPERS
   ========================================================================== */
function initContactSystem() {
  const contactForm = document.getElementById('contactForm');
  const quickCopyEmailBtn = document.getElementById('quickCopyEmailBtn');
  const copyableElements = document.querySelectorAll('.copyable, .copyable-btn');
  const openContactModalBtn = document.getElementById('openContactModalBtn');

  if (quickCopyEmailBtn) {
    quickCopyEmailBtn.addEventListener('click', () => {
      copyToClipboard('shubhamlad113@gmail.com', 'Email copied: shubhamlad113@gmail.com');
    });
  }

  if (openContactModalBtn) {
    openContactModalBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('contactName');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  }

  copyableElements.forEach(el => {
    el.addEventListener('click', () => {
      const val = el.getAttribute('data-copy');
      if (val) {
        copyToClipboard(val, `Copied to clipboard: ${val}`);
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const subject = document.getElementById('contactSubject')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Prepare mailto link as fallback
      const mailtoUrl = `mailto:shubhamlad113@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      showToast(`Thank you, ${name}! Launching email client to send your message.`, 'success');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }
}

/* ==========================================================================
   13. SCROLL SPY & MOBILE NAVIGATION
   ========================================================================== */
function initScrollSpyAndNav() {
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const menuIcon = document.getElementById('menuIcon');

  // Mobile menu toggle
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      if (navMenu.classList.contains('open')) {
        menuIcon.className = 'fa-solid fa-xmark';
      } else {
        menuIcon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Scroll spy
  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
function copyToClipboard(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage || 'Copied to clipboard!', 'success');
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
  document.body.removeChild(textArea);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '<i class="fa-solid fa-circle-info text-accent"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check text-success"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation text-danger"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
