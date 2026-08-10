/**
 * Every word on this site comes from here.
 *
 * Content is transcribed from the lab's existing site
 * (tbvl22.github.io/website). Where a number is displayed anywhere in the
 * UI it is derived from these arrays rather than typed by hand, so a
 * counter can never disagree with the list it counts.
 */

export const lab = {
  name: "Trustworthy BiometraVision Lab",
  short: "TBVL",
  tagline: "Advancing Trustworthy Artificial Intelligence",
  institution: "IISER Bhopal",
  department: "Department of Data Science & Engineering",
  intro:
    "At the forefront of state-of-the-art studies in biometrics recognition, computer vision, generative learning, signal processing, and medical data analysis.",
  mission:
    "We build innovative, ethical, and robust solutions for real-world challenges — interdisciplinary research grounded in four properties we refuse to trade against each other.",
  /** The four properties the lab says its work is grounded in. */
  principles: [
    {
      key: "Fair",
      body: "A model that works well on average can still fail a demographic entirely. We measure the gap, not the mean.",
    },
    {
      key: "Accurate",
      body: "Benchmarks are a floor, not a finish line. Accuracy has to survive corruption, distance, resolution and attack.",
    },
    {
      key: "Trustworthy",
      body: "Systems that decide who someone is must hold up when someone actively tries to break them.",
    },
    {
      key: "Explainable",
      body: "A decision you cannot inspect is a decision you cannot contest. We localise the evidence, not just the label.",
    },
  ],
};

export const funding = [
  {
    body: "Anusandhan National Research Foundation",
    award: "Prime Minister's Early Career Research Grant (ECRG)",
    short: "ANRF",
  },
  {
    body: "Defence Research and Development Organisation",
    award: "Approved research project",
    short: "DRDO",
  },
];

/* ------------------------------------------------------------------ */
/* Research                                                            */
/* ------------------------------------------------------------------ */

/**
 * The eight areas listed on the lab's research page. `links` names the
 * other areas each one shares methods with — it drives the constellation
 * edges, so the diagram encodes how the lab's work actually connects
 * rather than being drawn for decoration.
 */
export type ResearchArea = {
  id: string;
  title: string;
  short: string;
  body: string;
  links: string[];
};

export const research: ResearchArea[] = [
  {
    id: "trust",
    title: "Secure & Trustworthy Vision",
    short: "Trustworthy AI",
    body: "Spoofing, adversarial patches, deepfakes and corruption all attack the same weak point: a model that was only ever tested on clean data. We build identification systems that hold under all four.",
    links: ["biometrics", "vision", "explainable"],
  },
  {
    id: "biometrics",
    title: "Biometrics Recognition",
    short: "Biometrics",
    body: "Face, iris, fingerprint, voice and ear — recognition across distance, pose, resolution and the ordinary mess of unconstrained capture.",
    links: ["trust", "vision", "threed"],
  },
  {
    id: "generative",
    title: "Generative AI",
    short: "Generative AI",
    body: "Diffusion models and GANs, studied from both ends: as tools for normalising and restoring degraded imagery, and as the engines behind the forgeries we have to detect.",
    links: ["vision", "trust", "threed"],
  },
  {
    id: "explainable",
    title: "Explainable AI",
    short: "Explainable AI",
    body: "Saliency and attribution methods that localise the manipulated region, so a detector's output can be audited rather than believed.",
    links: ["trust", "efficient", "biometrics"],
  },
  {
    id: "efficient",
    title: "Effective & Efficient AI",
    short: "Efficient AI",
    body: "Architectures that earn their parameter count. Where a simple fusion outperforms a complex network, we would rather ship the simple fusion.",
    links: ["architectures", "explainable", "vision"],
  },
  {
    id: "architectures",
    title: "Architectures & Theory",
    short: "Deep Learning",
    body: "Novel deep learning architectures and the theory underneath them — wavelet transformers, entropy-guided fine-tuning, and what network depth really does to misclassification.",
    links: ["efficient", "generative", "vision"],
  },
  {
    id: "threed",
    title: "3D Computer Vision",
    short: "3D Vision",
    body: "Neural radiance fields and 3D reconstruction, including what happens to identity when a face is rebuilt from views rather than captured.",
    links: ["vision", "generative", "biometrics"],
  },
  {
    id: "vision",
    title: "Drone-Based Surveillance",
    short: "Computer Vision",
    body: "Recognition from altitude, where subjects are small, motion-blurred, and never cooperating with the camera.",
    links: ["biometrics", "threed", "efficient"],
  },
];

/* ------------------------------------------------------------------ */
/* Publications                                                        */
/* ------------------------------------------------------------------ */

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: number;
  /** Coarse venue class, used for filtering and for the venue tag. */
  kind: "Conference" | "Journal" | "Workshop" | "Abstract";
  tier?: string;
  link?: string;
  note?: string;
};

export const publications: Publication[] = [
  {
    title: "Visible Yet Unrecognizable: Frequency-Selective Facial Privacy via Attention",
    authors: "Atul Kumar, Akshay Agarwal",
    venue: "European Conference on Computer Vision",
    year: 2026,
    kind: "Conference",
    tier: "ECCV",
  },
  {
    title: "Breaking Rigidity in Adversarial Patch Attacks",
    authors: "Vishesh Kumar, Guha Balakrishnan, Akshay Agarwal",
    venue: "European Conference on Computer Vision",
    year: 2026,
    kind: "Conference",
    tier: "ECCV",
  },
  {
    title:
      "Feature Collapse Under Corruption: An Entropy Perspective on Robust Neural Networks",
    authors: "Vishesh Kumar, Akshay Agarwal",
    venue: "International Conference on Machine Learning",
    year: 2026,
    kind: "Conference",
    tier: "ICML",
  },
  {
    title: "The Unseen Adversaries: Robust and Generalized Defense Against Adversarial Patches",
    authors: "Vishesh Kumar, Akshay Agarwal",
    venue: "International Conference on Artificial Intelligence and Statistics",
    year: 2026,
    kind: "Conference",
    tier: "AISTATS",
  },
  {
    title: "Tap, Scan, Exploit: The Hidden Vulnerabilities of Everyday QR Codes",
    authors: "Ashish Kumar, S Aarthi, Akshay Agarwal",
    venue: "IEEE/CVF Computer Vision and Pattern Recognition, Findings",
    year: 2026,
    kind: "Conference",
    tier: "CVPR",
  },
  {
    title:
      "Guarding Digital Identity: Attention-Guided Fusion for Detecting Forged ID Documents",
    authors: "Gargi Surendra Yeole, Poulomi Bhattacharya, Akshay Agarwal",
    venue: "AAAI Conference on Artificial Intelligence",
    year: 2026,
    kind: "Abstract",
    tier: "AAAI",
    note: "Student Abstract",
  },
  {
    title: "WingBeats and Snapshots: Fusing Sound and Vision for Mosquito Monitoring",
    authors: "Ahana Chanda, Akshay Agarwal",
    venue: "AAAI Conference on Artificial Intelligence",
    year: 2026,
    kind: "Abstract",
    tier: "AAAI",
    note: "Student Abstract",
  },
  {
    title:
      "Semantic-Guided Sketch-to-RGB Image Generation via Controlled Diffusion for Improved Sketch Recognition",
    authors: "Ritika Jain, Atul Kumar, Akshay Agarwal",
    venue: "AAAI Conference on Artificial Intelligence",
    year: 2026,
    kind: "Abstract",
    tier: "AAAI",
    note: "Student Abstract",
  },
  {
    title: "Q-MoFusion: A Quantum Classifier for Mosquito Species Classification",
    authors: "Vishesh Kumar, Ahana Chanda, Poulomi Bhattacharya, Akshay Agarwal",
    venue: "AAAI Conference on Artificial Intelligence",
    year: 2026,
    kind: "Abstract",
    tier: "AAAI",
    note: "Student Abstract",
  },
  {
    title: "Improving CAPTCHA Robustness via Controlled Image Corruptions",
    authors: "Suchetan G. Uppur, Ashish Kumar, Akshay Agarwal",
    venue: "AAAI Conference on Artificial Intelligence",
    year: 2026,
    kind: "Abstract",
    tier: "AAAI",
    note: "Student Abstract",
  },
  {
    title: "Traces Left Behind: Deepfake Detection Under the Lens of Iterative Generation",
    authors: "Poulomi Bhattacharya, Akshay Agarwal, Nalini Ratha",
    venue: "CVPR Workshop on AI for Media Security",
    year: 2026,
    kind: "Workshop",
    tier: "CVPRW",
  },
  {
    title: "Faces in the Wild: GAN-Driven Normalization for Robust Facial Recognition",
    authors: "Mohit, Atul Kumar, Akshay Agarwal",
    venue: "CVPR Workshop on Computer Vision for Everyone",
    year: 2026,
    kind: "Workshop",
    tier: "CVPRW",
  },

  {
    title: "A Unified, Resilient, and Explainable Adversarial Patch Detector",
    authors: "Vishesh Kumar, Akshay Agarwal",
    venue: "IEEE/CVF Conference on Computer Vision and Pattern Recognition",
    year: 2025,
    kind: "Conference",
    tier: "CVPR",
    link: "https://openaccess.thecvf.com/content/CVPR2025/papers/Kumar_A_Unified_Resilient_and_Explainable_Adversarial_Patch_Detector_CVPR_2025_paper.pdf",
  },
  {
    title: "On Adversarial Robustness of Face Presentation Attack Detection Algorithms",
    authors: "Akshay Agarwal, Mayank Vatsa, Richa Singh",
    venue: "IEEE/CVF International Conference on Computer Vision",
    year: 2025,
    kind: "Conference",
    tier: "ICCV",
  },
  {
    title:
      "On Which Data Distribution (Synthetic or Real) We Should Rely for Soft Biometric Classification",
    authors: "Manju RA, Atul Kumar, Akshay Agarwal",
    venue: "Winter Conference on Applications of Computer Vision",
    year: 2025,
    kind: "Conference",
    tier: "WACV",
    link: "https://openaccess.thecvf.com/content/WACV2025/papers/A_On_Which_Data_Distribution_Synthetic_or_Real_We_Should_Rely_WACV_2025_paper.pdf",
  },
  {
    title:
      "Robustness Benchmarking of Convolutional and Transformer Architectures for Image Classification",
    authors: "Vishesh Kumar, Shivam Shukla, Akshay Agarwal",
    venue: "IEEE Transactions on Big Data",
    year: 2025,
    kind: "Journal",
    tier: "T-BD",
  },
  {
    title: "Detection of Identity Swapping Attacks in Low-Resolution Image Settings",
    authors: "Akshay Agarwal, Nalini Ratha",
    venue: "Journal of Information Security and Applications",
    year: 2025,
    kind: "Journal",
    link: "https://www.sciencedirect.com/science/article/pii/S2214212624002138",
  },
  {
    title:
      "Bayesian-Optimized Recursive Machine Learning for Predicting Human-Induced Changes in Suspended Sediment Transport",
    authors: "Soumya Kundu, Somil Swarnkar, Akshay Agarwal",
    venue: "Environmental Monitoring and Assessment",
    year: 2025,
    kind: "Journal",
    link: "https://link.springer.com/article/10.1007/s10661-025-14039-w",
  },
  {
    title: "Unmasking the Audio Illusion: A Survey on Spoofing and Deepfake Detection",
    authors: "Aarthi S, Akshay Agarwal",
    venue: "IEEE International Joint Conference on Biometrics",
    year: 2025,
    kind: "Conference",
    tier: "IJCB",
  },
  {
    title: "Your Face, Your Privacy: Combating Unauthorized Usage",
    authors: "Atul Kumar, Akshay Agarwal, Nalini Ratha",
    venue: "IEEE International Conference on Automatic Face and Gesture Recognition",
    year: 2025,
    kind: "Conference",
    tier: "FG",
  },
  {
    title: "Gesture Recognition for Emergencies: Dataset and Cross-Condition Analysis",
    authors: "Jiya Sinha, Poulomi Bhattacharya, Akshay Agarwal",
    venue: "IEEE International Conference on Automatic Face and Gesture Recognition",
    year: 2025,
    kind: "Conference",
    tier: "FG",
  },
  {
    title: "Family Resemblance or Fraud? Face Morphing Attacks on Kinship Verification",
    authors: "Gargi S Yeole, Aarthi S, Shalvika Srivastav, Akshay Agarwal",
    venue: "Workshop on Interdisciplinary Applications of Biometrics and Identity Science, FG",
    year: 2025,
    kind: "Workshop",
    tier: "FGW",
  },
  {
    title: "Advancing Facial Age Progression for Occluded Faces",
    authors: "Ankit Birla, Akshay Agarwal",
    venue: "CVPR Workshop on Affective & Behavior Analysis in-the-wild",
    year: 2025,
    kind: "Workshop",
    tier: "CVPRW",
  },
  {
    title:
      "Identity in the Blood Relation: Unraveling the Complexity of Morph Detection in Kinship Biometrics",
    authors: "Shalvika Srivastav, Poulomi Bhattacharya, Akshay Agarwal, Nalini Ratha",
    venue: "PFATCV Workshop, British Machine Vision Conference",
    year: 2025,
    kind: "Workshop",
    tier: "BMVCW",
  },
  {
    title: "Brain Matters: Enhancing Tumor Classification via CNN and Vision-Language Fusion",
    authors: "Chaudhari Khushi Ganesh, Akshay Agarwal",
    venue: "British Machine Vision Conference Workshop",
    year: 2025,
    kind: "Workshop",
    tier: "BMVCW",
  },
  {
    title: "On Visual Saliency Maps for Identifying Fidelity of Deepfake Detection Datasets",
    authors: "Agniva Banerjee, Samiran Das, Akshay Agarwal",
    venue: "British Machine Vision Conference Workshop",
    year: 2025,
    kind: "Workshop",
    tier: "BMVCW",
  },
  {
    title: "PrecipFormer: Efficient Transformer for Precipitation Downscaling",
    authors: "R. Kumar, T. Sharma, V. Vaghela, S. Jha, A. Agarwal",
    venue: "Winter Conference on Applications of Computer Vision Workshops",
    year: 2025,
    kind: "Workshop",
    tier: "WACVW",
  },
  {
    title: "On the Robustness of Iris Presentation Attack Detectors",
    authors: "Aditya Sneh, Akshay Agarwal",
    venue: "SSRN Preprint 4918189",
    year: 2025,
    kind: "Journal",
  },

  {
    title: "Corruption Depth: Analysis of DNN Depth for Misclassification",
    authors: "A. Agarwal, M. Vatsa, R. Singh, N. Ratha",
    venue: "Neural Networks, vol. 172, pp. 106013",
    year: 2024,
    kind: "Journal",
    link: "https://www.sciencedirect.com/science/article/pii/S0893608023006585",
  },
  {
    title: "Indian Traffic Sign Detection and Classification Through a Unified Framework",
    authors: "R. Uikey, H. R. Lone, A. Agarwal",
    venue: "IEEE Transactions on Intelligent Transportation Systems, vol. 25, no. 10",
    year: 2024,
    kind: "Journal",
    tier: "T-ITS",
  },
  {
    title: "Deepfake Catcher: Can a Simple Fusion be Effective and Outperform Complex DNNs?",
    authors: "A. Agarwal, N. Ratha",
    venue: "CVPR Workshop and Challenge on DeepFake Analysis and Detection",
    year: 2024,
    kind: "Workshop",
    tier: "CVPRW",
    link: "https://openaccess.thecvf.com/content/CVPR2024W/DFAD/papers/Agarwal_Deepfake_Catcher_Can_a_Simple_Fusion_be_Effective_and_Outperform_CVPRW_2024_paper.pdf",
  },
  {
    title: "Deepfake: Classifiers, Fairness, and Demographically Robust Algorithm",
    authors: "A. Agarwal, N. Ratha",
    venue: "IEEE International Conference on Automatic Face and Gesture Recognition",
    year: 2024,
    kind: "Conference",
    tier: "FG",
    link: "https://brosdocs.net/fg2024/061.pdf",
  },
  {
    title: "Are Object Recognition Models Effective and Unbiased for Biometric Recognition?",
    authors: "V. Kumar, A. Agarwal",
    venue: "IEEE International Joint Conference on Biometrics",
    year: 2024,
    kind: "Conference",
    tier: "IJCB",
    link: "https://ieeexplore.ieee.org/document/10744463",
  },
  {
    title: "Is Face Super Resolution Truly Pushing the Boundaries of Face Recognition?",
    authors: "M. Dosi, U. Rathore, C. Chiranjeev, A. Agarwal, R. Singh, M. Vatsa",
    venue: "IEEE International Joint Conference on Biometrics",
    year: 2024,
    kind: "Conference",
    tier: "IJCB",
    link: "https://ieeexplore.ieee.org/document/10744440",
  },
  {
    title: "Benchmarking In-the-wild Soft Biometric Attribute Identification",
    authors: "M. RA, A. Agarwal",
    venue: "IEEE International Joint Conference on Biometrics",
    year: 2024,
    kind: "Conference",
    tier: "IJCB",
    link: "https://ieeexplore.ieee.org/document/10744471",
  },
  {
    title: "Enhancing Drug Abuse Face Recognition: A Study on Image Corruption and Restoration",
    authors: "H. Dhake, A. Agarwal",
    venue: "IEEE International Joint Conference on Biometrics",
    year: 2024,
    kind: "Conference",
    tier: "IJCB",
    link: "https://ieeexplore.ieee.org/document/10744470",
  },
  {
    title: "Supervised Mixup: Protecting the Likely Classes for Adversarial Robustness",
    authors: "A. Agarwal, M. Vatsa, R. Singh, N. Ratha",
    venue: "IEEE/IAPR International Conference on Pattern Recognition",
    year: 2024,
    kind: "Conference",
    tier: "ICPR",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-78169-8_3",
  },
  {
    title:
      "An Unconstrained Dataset for Face Recognition Across Distance, Pose, and Resolution",
    authors: "U. Rathore, A. Agarwal",
    venue: "IEEE/IAPR International Conference on Pattern Recognition",
    year: 2024,
    kind: "Conference",
    tier: "ICPR",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-78341-8_9",
  },
  {
    title:
      "Robustness of Classifiers for AI-Generated Text Detectors for Copyright and Privacy Protected Society",
    authors: "A. Agarwal, M. Uzair",
    venue: "IEEE/IAPR International Conference on Pattern Recognition",
    year: 2024,
    kind: "Conference",
    tier: "ICPR",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-78498-9_5",
  },
  {
    title:
      "Neural Encoding of Odors: Translating Odors into Unique Digital Representation with EEG Signals",
    authors: "A. Yadav, V. Pareek, A. Agarwal, S. Chaudhury",
    venue: "IEEE/IAPR International Conference on Pattern Recognition",
    year: 2024,
    kind: "Conference",
    tier: "ICPR",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-78183-4_18",
  },
  {
    title: "Restoring Noisy Images Using Dual-tail Encoder-Decoder Signal Separation Network",
    authors: "A. Agarwal, M. Vatsa, R. Singh, N. Ratha",
    venue: "IEEE/IAPR International Conference on Pattern Recognition",
    year: 2024,
    kind: "Conference",
    tier: "ICPR",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-78107-0_21",
  },
  {
    title: "A Multi-Modal Framework to Counter Hate Speeches",
    authors: "K. Bhesra, A. Agarwal",
    venue: "IEEE/IAPR International Conference on Pattern Recognition",
    year: 2024,
    kind: "Conference",
    tier: "ICPR",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-78119-3_14",
  },
  {
    title: "Face Morphing Detection in Social Media Content",
    authors: "A. Agarwal, N. Ratha",
    venue: "IEEE International Conference on Image Processing",
    year: 2024,
    kind: "Conference",
    tier: "ICIP",
    link: "https://ieeexplore.ieee.org/document/10648209",
  },
  {
    title:
      "Unravelling Robustness of Deep Face Recognition Networks Against Illicit Drug Abuse Images",
    authors: "H. Dhake, A. Agarwal",
    venue: "CVPR Workshop on Affective Behavior Analysis in-the-wild",
    year: 2024,
    kind: "Workshop",
    tier: "CVPRW",
    link: "https://openaccess.thecvf.com/content/CVPR2024W/ABAW/papers/Dhake_Unravelling_Robustness_of_Deep_Face_Recognition_Networks_Against_Illicit_Drug_CVPRW_2024_paper.pdf",
  },
  {
    title: "A Generalized Semiconductor Wafer Defect Classifier",
    authors: "P. Rai, P. Pal, A. Agarwal",
    venue: "ICLR TinyPapers",
    year: 2024,
    kind: "Abstract",
    tier: "ICLR",
    note: "Invited to present",
    link: "https://openreview.net/pdf?id=VAJVN44B5b",
  },
  {
    title: "Audio vs. Text: Identify a Powerful Modality for Effective Hate Speech Detection",
    authors: "K. Bhesra, S. Shukla, A. Agarwal",
    venue: "ICLR TinyPapers",
    year: 2024,
    kind: "Abstract",
    tier: "ICLR",
    note: "Invited to present",
    link: "https://openreview.net/pdf?id=dD2e3aCEcO",
  },
  {
    title: "A Novel Sector-Based Algorithm for an Optimized Star-Galaxy Classification",
    authors: "A. Likhit, D. Tripathi, A. Agarwal",
    venue: "ICLR TinyPapers",
    year: 2024,
    kind: "Abstract",
    tier: "ICLR",
    link: "https://openreview.net/pdf?id=HzEefCle2c",
  },
  {
    title: "On the Robustness of Drug Abuse Face Classification",
    authors: "H. Dhake, A. Agarwal",
    venue: "ICLR TinyPapers",
    year: 2024,
    kind: "Abstract",
    tier: "ICLR",
    link: "https://openreview.net/pdf?id=Jdk8o63wyP",
  },
  {
    title: "On the Effectiveness of a Hybrid Model for Volatility Prediction",
    authors: "SaiAsrith BEVNM, A. Agarwal",
    venue: "IEEE International Conference on Machine Learning and Applications",
    year: 2024,
    kind: "Conference",
    tier: "ICMLA",
  },
  {
    title:
      "Application of Machine-Learning Based Models for Prediction of Suspended Sediment Load in the Indian Peninsular River Basin",
    authors: "S. Kundu, S. Swarnkar, A. Agarwal",
    venue: "EGU General Assembly, Vienna",
    year: 2024,
    kind: "Abstract",
    link: "https://meetingorganizer.copernicus.org/EGU24/EGU24-1117.html",
  },

  {
    title: "Parameter Agnostic Stacked Wavelet Transformer for Detecting Singularities",
    authors: "A. Agarwal, M. Vatsa, R. Singh, N. Ratha",
    venue: "Information Fusion",
    year: 2023,
    kind: "Journal",
    link: "https://www.sciencedirect.com/science/article/pii/S1566253523000301",
  },
  {
    title: "IBAttack: Being Cautious About Data Labels",
    authors: "A. Agarwal, R. Singh, M. Vatsa, N. Ratha",
    venue: "IEEE Transactions on Artificial Intelligence",
    year: 2023,
    kind: "Journal",
    tier: "T-AI",
  },
  {
    title: "Motion Magnified 3-D Residual-in-Dense Network for DeepFake Detection",
    authors: "A. Mehra, A. Agarwal, M. Vatsa, R. Singh",
    venue: "IEEE Transactions on Biometrics, Behavior, and Identity Science, vol. 5",
    year: 2023,
    kind: "Journal",
    tier: "T-BIOM",
  },
  {
    title:
      "Misclassifications of Contact Lens Iris PAD Algorithms: Is It Gender Bias or Environmental Conditions?",
    authors: "A. Agarwal, N. Ratha, A. Noore, R. Singh, M. Vatsa",
    venue: "IEEE/CVF Winter Conference on Applications of Computer Vision",
    year: 2023,
    kind: "Conference",
    tier: "WACV",
    link: "https://openaccess.thecvf.com/content/WACV2023/html/Agarwal_Misclassifications_of_Contact_Lens_Iris_PAD_Algorithms_Is_It_Gender_WACV_2023_paper.html",
  },
  {
    title: "Benchmarking Image Classifiers for Physical Out-of-Distribution Examples Detection",
    authors: "Ojaswee, A. Agarwal, N. Ratha",
    venue: "ICCV Workshop on Out-of-Distribution Generalization in Computer Vision",
    year: 2023,
    kind: "Workshop",
    tier: "ICCVW",
    link: "https://openaccess.thecvf.com/content/ICCV2023W/OODCV/html/Ojaswee_Benchmarking_Image_Classifiers_for_Physical_Out-of-Distribution_Examples_Detection_ICCVW_2023_paper.html",
  },
  {
    title: "On Unconstrained Ear Recognition for Privacy-Preserving Authentication",
    authors: "V. Kumar, A. Agarwal",
    venue: "Workshop on Advances of Mobile and Wearable Biometrics, MobileHCI",
    year: 2023,
    kind: "Workshop",
  },
  {
    title: "Attention Guided Multi-attribute Architecture for Deepfake Detection",
    authors: "R. Sharma, B. Jawade, A. Agarwal, S. Setlur, N. Ratha",
    venue: "IEEE Western New York Image and Signal Processing Workshop",
    year: 2023,
    kind: "Workshop",
    link: "https://ieeexplore.ieee.org/abstract/document/10349650",
  },
  {
    title: "Federated Learning for Local and Global Data Distribution",
    authors: "G. Goswami, A. Agarwal, N. K. Ratha, R. Singh, M. Vatsa",
    venue: "ICLR TinyPapers",
    year: 2023,
    kind: "Abstract",
    tier: "ICLR",
    link: "https://openreview.net/pdf?id=qX8cGLnfAd",
  },
  {
    title: "Is DFR for Soft Biometrics Prediction in Unconstrained Images Fair and Effective?",
    authors: "U. Rathore, A. Agarwal",
    venue: "ICLR TinyPapers",
    year: 2023,
    kind: "Abstract",
    tier: "ICLR",
    link: "https://openreview.net/pdf?id=rLqN6XLbON",
  },
  {
    title: "On the Robustness of Stock Market Regressors",
    authors: "A. Agarwal, N. Ratha",
    venue: "Workshop on Modelling Uncertainty in the Financial World, AAAI",
    year: 2023,
    kind: "Workshop",
    tier: "AAAIW",
  },

  {
    title: "Crafting Adversarial Perturbations via Transformed Image Component Swapping",
    authors: "A. Agarwal, N. Ratha, M. Vatsa, R. Singh",
    venue: "IEEE Transactions on Image Processing, vol. 31",
    year: 2022,
    kind: "Journal",
    tier: "T-IP",
    link: "https://ieeexplore.ieee.org/abstract/document/9887823",
  },
  {
    title: "Manipulating Faces for Identity Theft via Morphing and Deepfake",
    authors: "A. Agarwal, N. Ratha",
    venue: "Handbook of Statistics: Deep Learning, Elsevier",
    year: 2022,
    kind: "Journal",
    link: "https://www.sciencedirect.com/science/article/abs/pii/S016971612200058X",
  },
  {
    title: "On Deep Learning for Dorsal Hand Vein Recognition",
    authors: "S. Bagchi, G. Chanda, A. Agarwal, N. Ratha",
    venue: "IEEE Western New York Image and Signal Processing Workshop",
    year: 2022,
    kind: "Workshop",
    link: "https://ieeexplore.ieee.org/abstract/document/9982726",
  },
];

/* ------------------------------------------------------------------ */
/* Members                                                             */
/* ------------------------------------------------------------------ */

export const faculty = {
  name: "Dr. Akshay Agarwal",
  role: "Principal Investigator",
  affiliation: "Department of Data Science & Engineering, IISER Bhopal",
  email: "akagarwal@iiserb.ac.in",
  office: "310 A, AB4 (Therm) Building",
  interests: [
    "Fair and Trustworthy AI/ML",
    "Biometrics Recognition",
    "Generative Algorithms",
    "Deep Learning in Computer Vision",
    "Medical & Brain Image Analysis",
    "NLP / Speech",
  ],
  note: "Senior Member, IEEE",
};

export type Member = { name: string; email?: string };

export const groups: { label: string; note: string; people: Member[] }[] = [
  {
    label: "PhD Scholars",
    note: "Doctoral researchers",
    people: [
      { name: "Vishesh Kumar", email: "vishesh22@iiserb.ac.in" },
      { name: "Atul Kumar", email: "atulk23@iiserb.ac.in" },
      { name: "Pavan Rajak", email: "pavan23@iiserb.ac.in" },
      { name: "S Aarthi", email: "saarthi24@iiserb.ac.in" },
      { name: "Poulomi Bhattacharya", email: "poulomi24@iiserb.ac.in" },
      { name: "Shubhi Gehlot", email: "shubhi24@iiserb.ac.in" },
      { name: "Aman Singh", email: "amans25@iiserb.ac.in" },
    ],
  },
  {
    label: "MS Students",
    note: "Master's thesis",
    people: [
      { name: "Anirudha Patil", email: "anirudha22@iiserb.ac.in" },
      { name: "Saptarshi Halder", email: "saptarshi22@iiserb.ac.in" },
      { name: "Ashish Raj", email: "ashishraj22@iiserb.ac.in" },
      { name: "Nayana Barai", email: "nayana21@iiserb.ac.in" },
      { name: "Nandhana K S", email: "nandhana22@iiserb.ac.in" },
    ],
  },
  {
    label: "BS Students",
    note: "Undergraduate research",
    people: [
      { name: "Atul Sonkar" },
      { name: "Pragati Nayak" },
      { name: "Sankul Rahate" },
      { name: "Mayank Srivastava" },
      { name: "Sejal Dayma" },
      { name: "Jash Lal" },
      { name: "Palak Kumari" },
      { name: "Lakshay Saini" },
      { name: "Chirag Maheshwari" },
      { name: "Harshal Digarse" },
    ],
  },
  {
    label: "JRF & Interns",
    note: "Research fellows",
    people: [{ name: "Rounak Mukhopadhyay", email: "rounakm@iiserb.ac.in" }],
  },
];

export const alumni = {
  graduate: [
    "Sharayu Borade",
    "Gurleen Kaur",
    "Khushi Chaudhari",
    "Gargi Surendra Yeole",
    "Ashish Kumar",
    "Ritika Jain",
    "Rohit Kumar",
    "Nagawade Shambhuraje Satish",
    "Ayush Pandey",
    "Mohit",
    "Shukla Shivam Ashokbhai",
    "Harshul Raj Surana",
    "Dhake Hruturaj Mahendra",
    "Saragadam Abhiram Laxmi Raj",
    "Jayasri Dharmireddi",
    "Udaybhan Rathore",
    "Aditya Sneh",
    "Manav Kundal",
    "Archana Yadav",
    "Ojaswee",
  ],
  undergraduate: [
    "Jiya Sinha",
    "Sakshi Tiwari",
    "Tanishq Sharma",
    "Rashi Bhardo",
    "Akshat Pandey",
    "Singh Arjita Satya Prakash",
    "Siddhi Pravin Lipare",
    "Shalvika Srivastav",
    "Aryan Jain",
  ],
  associates: ["Ahana Chanda", "Ankit Birla", "Manju RA"],
};

/* ------------------------------------------------------------------ */
/* News                                                                */
/* ------------------------------------------------------------------ */

/**
 * The source site lists news without dates, so these carry a `period`
 * label rather than a fabricated date — the ordering is the source's own.
 */
export type NewsItem = {
  period: string;
  kind: "Grant" | "Paper" | "Award" | "Program" | "Event";
  text: string;
};

export const news: NewsItem[] = [
  {
    period: "Latest",
    kind: "Grant",
    text: "Our project has been approved under the Prime Minister's Early Career Research Grant (ECRG) by the Anusandhan National Research Foundation.",
  },
  {
    period: "Latest",
    kind: "Grant",
    text: "Our project has been approved under the Defence Research and Development Organisation.",
  },
  {
    period: "2026",
    kind: "Paper",
    text: "Two papers from our lab were accepted at ECCV 2026 (CORE A*).",
  },
  {
    period: "2026",
    kind: "Paper",
    text: "Research from TBVL accepted at ICML 2026 — Vishesh Kumar and Akshay Agarwal.",
  },
  {
    period: "2026",
    kind: "Award",
    text: "Vishesh Rajput received travel grants from ACM IARCS and AISTATS to present at AISTATS 2026.",
  },
  {
    period: "2025",
    kind: "Award",
    text: "Atul Kumar was awarded the 41st MP Young Scientist Award.",
  },
  {
    period: "2025",
    kind: "Paper",
    text: "Ritika Jain and Atul Kumar had a paper accepted at WiML 2025.",
  },
  {
    period: "2025",
    kind: "Award",
    text: "Atul Kumar won the Best Poster Award at Engineers' Day 2025.",
  },
  {
    period: "2025",
    kind: "Paper",
    text: "Khushi Chaudhari had a paper accepted at the DIFA 2025 Workshop.",
  },
  {
    period: "2025",
    kind: "Event",
    text: "Our patch-based manipulation detector was featured in the media.",
  },
  {
    period: "2025",
    kind: "Paper",
    text: "Paper accepted at the PFATCV Workshop, BMVC 2025.",
  },
  {
    period: "2025",
    kind: "Program",
    text: "Vishesh Rajput was selected for the Mehta–Rice Scholars Program.",
  },
  {
    period: "2025",
    kind: "Award",
    text: "S. Aarthi received the Outstanding Reviewer Award at IJCB.",
  },
  {
    period: "2025",
    kind: "Paper",
    text: "Vishesh Kumar had a paper accepted in IEEE Transactions on Big Data.",
  },
  {
    period: "2025",
    kind: "Paper",
    text: "S. Aarthi's survey paper was accepted at IJCB.",
  },
  {
    period: "2025",
    kind: "Award",
    text: "Dr. Akshay Agarwal received ANRF International Travel Support for CVPR 2025.",
  },
  {
    period: "2025",
    kind: "Award",
    text: "Dr. Akshay Agarwal was promoted to Senior Member of IEEE.",
  },
  {
    period: "2025",
    kind: "Event",
    text: "We ran the Workshop on Unmasking Deepfakes at the IEEE Conference on AI 2025.",
  },
  { period: "2024", kind: "Event", text: "The TBVL Lab Magazine 2024 was released." },
];

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */

export const achievements = [
  {
    title: "41st MP Young Scientist Award",
    who: "Atul Kumar",
    body: "State recognition for early-career research contribution in Madhya Pradesh.",
    tag: "Award",
  },
  {
    title: "Seed Grant for Face Privacy R&D",
    who: "Atul Kumar",
    body: "₹2 lakh awarded under the 'Convert your Ph.D. journey into a startup' scheme.",
    tag: "Grant",
    amount: "₹2L",
  },
  {
    title: "Mehta–Rice Engineering Scholar Program",
    who: "Vishesh Rajput",
    body: "Selected for MRESP, recognising exceptional potential in research and innovation.",
    tag: "Program",
  },
  {
    title: "Outstanding Reviewer Award",
    who: "S. Aarthi",
    body: "Recognised at the IEEE International Joint Conference on Biometrics 2025.",
    tag: "Award",
  },
  {
    title: "Best Poster Presentation",
    who: "Atul Kumar",
    body: "Honoured for poster presentation at Engineers' Day 2025.",
    tag: "Award",
  },
  {
    title: "Patch-Based Manipulation Detector",
    who: "Lab",
    body: "A detector for manipulated images and video that drew national media coverage.",
    tag: "Media",
  },
  {
    title: "Deepfake Manipulation Detector",
    who: "Lab",
    body: "A system that flags manipulated content across media formats.",
    tag: "Media",
  },
  {
    title: "Unconstrained Ear Recognition",
    who: "Lab",
    body: "Biometric research covered in the press for its robustness and reliability.",
    tag: "Media",
  },
  {
    title: "Smart Vehicle for Fish Farming",
    who: "Lab",
    body: "An invention built to assist fish farming operations.",
    tag: "Invention",
  },
];

/* ------------------------------------------------------------------ */
/* Startups                                                            */
/* ------------------------------------------------------------------ */

export const startups = [
  {
    name: "GuardMyPrivacy Private Limited",
    status: "Incubated",
    people: "Founded by Atul Kumar",
    body: "Secure, privacy-preserving biometric solutions that combat unauthorised usage and enhance user privacy.",
    support: "Incubated under AIC-IISERB",
  },
  {
    name: "AIC SEED Plan-E",
    status: "Innovation Grant",
    people: "Dr. Akshay Agarwal, Atul Kumar",
    body: "Selected in Cohort-1 at IISER Pune to translate lab research into startup models.",
    support: "IISER Pune",
  },
  {
    name: "Student Innovation Grant",
    status: "Student Grant",
    people: "Dr. Akshay Agarwal, Atul Kumar, S Aarthi",
    body: "Supports student-led innovations with significant potential for commercialisation and societal benefit.",
    support: "SIG",
  },
];

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  lab: "310B, 3rd Floor, Academic Building 4",
  address: "IISER Bhopal, Bhopal 462066, Madhya Pradesh, India",
  email: "tbvl2022@gmail.com",
  office: "+91 755 269 2691",
  labPhone: "+91 755 269 2692",
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/trustworthy-biometravision-lab/",
    },
    { label: "GitHub", href: "https://github.com/tbvl22" },
    { label: "Hugging Face", href: "https://huggingface.co/tbvl" },
  ],
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navLeft = [
  { id: "research", label: "Research" },
  { id: "publications", label: "Publications" },
  { id: "startups", label: "Startups" },
];

export const navRight = [
  { id: "members", label: "Members" },
  { id: "news", label: "News" },
  { id: "achievements", label: "Achievements" },
];
