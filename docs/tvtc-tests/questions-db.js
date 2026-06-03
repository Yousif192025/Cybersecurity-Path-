// docs/tvtc-tests/questions-db.js
// قاعدة بيانات شاملة لأسئلة اختبارات الأمن السيبراني
// مستخرجة من ملف cyber-pretest.txt

const TVTC_QUESTIONS = {
    // ==================== المستوى الثالث ====================
    "NetworkDefense": {
        title: "🛡️ الدفاع عن الشبكات",
        level: 3,
        category: "network",
        description: "أسئلة في مجال حماية الشبكات وأمن البنية التحتية",
        totalQuestions: 190,
        questions: [
            {
                id: "ND001",
                text: "IP addresses that start with ______ are used for testing purposes",
                options: ["127", "10", "168", "192"],
                correct: 0,
                explanation: "127.x.x.x addresses are reserved for loopback testing."
            },
            {
                id: "ND002",
                text: "How many layers are there in the OSI networking model?",
                options: ["4", "5", "6", "7"],
                correct: 3,
                explanation: "The OSI model consists of 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application."
            },
            {
                id: "ND003",
                text: "Network Address Translation is when?",
                options: [
                    "A router encrypts all traffic entering the network",
                    "A router removes all unwanted data",
                    "A router replaces the public IP address in outgoing packets with the gateway's private IP address",
                    "A router replaces the private IP address in outgoing packets with the gateway's public IP address"
                ],
                correct: 3,
                explanation: "NAT translates private IPs to public ones so they can access the internet."
            },
            {
                id: "ND004",
                text: "Which layer groups data into frames?",
                options: ["Physical layer", "Data link layer", "Network layer", "Transport layer"],
                correct: 1,
                explanation: "The Data Link layer is responsible for framing."
            },
            {
                id: "ND005",
                text: "Which layer is closest to the user?",
                options: ["Physical layer", "Data link layer", "Presentation layer", "Application layer"],
                correct: 3,
                explanation: "The Application layer interfaces directly with the user."
            },
            {
                id: "ND006",
                text: "Which layer performs data formatting and translation like data compression/decompression?",
                options: ["Transport layer", "Session layer", "Presentation layer", "Application layer"],
                correct: 2,
                explanation: "The Presentation layer formats and translates data."
            },
            {
                id: "ND007",
                text: "Which layer handles unstructured raw bits?",
                options: ["Physical Layer", "Data-link layer", "Network layer", "Transport layer"],
                correct: 0,
                explanation: "The Physical layer deals with raw bit transmission."
            },
            {
                id: "ND008",
                text: "Which of the following IP spoofing defense techniques examines the IP headers of incoming traffic?",
                options: ["Egress filtering", "Ingress filtering", "Network address translation", "Frame inspection"],
                correct: 1,
                explanation: "Ingress filtering checks incoming IP headers for spoofing."
            },
            {
                id: "ND009",
                text: "Which activity is used by attackers to find open doors and services running on the network?",
                options: ["Exploitation", "Port Scanning", "Brute Forcing", "Cracking"],
                correct: 1,
                explanation: "Port scanning identifies open services on a network."
            },
            {
                id: "ND010",
                text: "What differentiates viruses from worms?",
                options: [
                    "Viruses exploit network vulnerabilities to spread",
                    "Worms inject themselves into other running processes",
                    "Worms lock machines and ask for ransom",
                    "Worms exploit network vulnerabilities to spread"
                ],
                correct: 3,
                explanation: "Worms can spread independently over networks, unlike viruses."
            },
            {
                id: "ND011",
                text: "What is often a result of programming mistakes?",
                options: ["Weak firewalls", "Cleartext traffic", "Open ports", "Buffer overflow vulnerabilities"],
                correct: 3,
                explanation: "Buffer overflow vulnerabilities are often caused by programming mistakes."
            },
            {
                id: "ND012",
                text: "Which attack targets availability by overloading device limitations?",
                options: ["Denial-of-Service", "IP Spoofing", "Man-in-the-Middle", "Buffer Overflow"],
                correct: 0,
                explanation: "Denial-of-Service attacks aim to exhaust computing resources."
            },
            {
                id: "ND013",
                text: "Which statement about subnet masks is false?",
                options: [
                    "They are used for subnetting",
                    "A subnet mask can be extended to the node portion of the IP",
                    "A subnet mask takes a maximum value of 512",
                    "Each number is transformed to binary to determine subnets and nodes"
                ],
                correct: 2,
                explanation: "A subnet mask is made of 4 octets and does not have a value of 512."
            },
            {
                id: "ND014",
                text: "Which solution monitors suspicious activities on the network?",
                options: ["Firewalls", "Proxy Servers", "IDS", "Application servers"],
                correct: 2,
                explanation: "Intrusion Detection Systems (IDS) monitor network traffic for suspicious activity."
            },
            {
                id: "ND015",
                text: "Which technique do firewalls use to analyze complete traffic flows?",
                options: ["Packet filtering", "Stateful packet inspection", "Routing", "Access Control Lists"],
                correct: 1,
                explanation: "Stateful packet inspection tracks the state of active connections."
            },
            {
                id: "ND016",
                text: "Which malware detection approach runs malware in a sandbox?",
                options: ["Static analysis", "Signature-based detection", "Behavior-based detection", "Misuse analysis"],
                correct: 2,
                explanation: "Behavior-based detection observes how software behaves, often in a sandbox."
            },
            {
                id: "ND017",
                text: "Which protocol suite offers protection against session hijacking?",
                options: ["SSL/TLS", "TCP/IP", "HTTP", "DNS"],
                correct: 0,
                explanation: "SSL/TLS encrypts sessions to protect against hijacking."
            },
            {
                id: "ND018",
                text: "Which protocol transforms hostnames to IP addresses?",
                options: ["Domain Name Service (DNS)", "File Transfer Protocol (FTP)", "Secure Socket Layer (SSL)", "Transmission Control Protocol (TCP)"],
                correct: 0,
                explanation: "DNS resolves hostnames into IP addresses."
            },
            {
                id: "ND019",
                text: "Which principle means an action cannot be denied later by whoever performed it?",
                options: ["Least Privileged", "Integrity", "Availability", "Non-repudiation"],
                correct: 3,
                explanation: "Non-repudiation ensures that someone cannot deny their actions."
            },
            {
                id: "ND020",
                text: "What are IP addresses used for?",
                options: [
                    "To identify computer users",
                    "To identify computers on a network",
                    "To identify programs on a computer",
                    "To identify computer locations in a building"
                ],
                correct: 1,
                explanation: "IP addresses are used to uniquely identify devices on a network."
            },
            {
                id: "ND021",
                text: "The CIA triad stands for?",
                options: [
                    "Confidentiality, Integrity, Appearance",
                    "Confidentiality, Information, Availability",
                    "Confidentiality, Integrity, Availability",
                    "Consequence, Integrity, Availability"
                ],
                correct: 2,
                explanation: "The CIA triad refers to Confidentiality, Integrity, and Availability."
            },
            {
                id: "ND022",
                text: "Which design principle says if security is hard to use, people will find ways around it?",
                options: ["Attack surface reduction", "Open design", "Fail safe", "Psychological Acceptability"],
                correct: 3,
                explanation: "Psychological Acceptability means security mechanisms should be easy to use."
            },
            {
                id: "ND023",
                text: "Which attack assumes the attacker has plaintext-ciphertext pairs not chosen by them?",
                options: ["Brute-force", "Birthday Attacks", "Chosen-Plaintext Attacks", "Known-Plaintext Attacks"],
                correct: 3,
                explanation: "In known-plaintext attacks, the attacker has plaintext and ciphertext pairs."
            },
            {
                id: "ND024",
                text: "Which attack tries every key combination to break encryption?",
                options: ["Brute-force", "Frequency analysis", "Rainbow tables", "Social engineering"],
                correct: 0,
                explanation: "Brute-force attacks involve trying all possible keys."
            },
            {
                id: "ND025",
                text: "Which attack analyzes ciphertext to determine if patterns exist?",
                options: ["Brute force attacks", "Steganalysis", "Frequency Analysis", "Rainbow tables"],
                correct: 2,
                explanation: "Frequency analysis studies ciphertext patterns to reveal plaintext."
            }
        ]
    },

    "EthicalHacking": {
        title: "🔓 الاختراق الأخلاقي",
        level: 3,
        category: "ethical_hacking",
        description: "أسئلة في مجال اختبار الاختراق والهندسة الاجتماعية",
        totalQuestions: 490,
        questions: [
            {
                id: "EH001",
                text: "Linux files have permissions to",
                options: ["Read", "Write", "Execute", "All of the above"],
                correct: 3,
                explanation: "Linux files can have read, write, and execute permissions."
            },
            {
                id: "EH002",
                text: "Even though Sara is a hacker, she is not necessarily a criminal.",
                options: ["صواب", "خطأ"],
                correct: 0,
                explanation: "Ethical hackers work legally to identify and fix security vulnerabilities."
            },
            {
                id: "EH003",
                text: "Ahmed is using hacking techniques for legal and ethical purposes.",
                options: ["Black hat hacker", "Ethical hacker", "Cracker", "Gray hat hacker"],
                correct: 1,
                explanation: "An ethical hacker uses hacking techniques legally to improve security."
            },
            {
                id: "EH004",
                text: "Khaled is a pen tester, the company informed him about IP addresses and OS info. What approach?",
                options: ["Grey Box", "Black Box", "White Box", "None"],
                correct: 2,
                explanation: "White box testing provides full knowledge of the target environment."
            },
            {
                id: "EH005",
                text: "In which phase does the tester use tools to identify open ports?",
                options: ["Reconnaissance", "Scanning", "Gain Access", "Clearing Tracks"],
                correct: 1,
                explanation: "The scanning phase identifies open ports and services."
            },
            {
                id: "EH006",
                text: "Attackers use social engineering to gather information from:",
                options: ["Facebook", "Maltego", "Shodan", "Whois"],
                correct: 0,
                explanation: "Social networking platforms like Facebook are used to gather information."
            },
            {
                id: "EH007",
                text: "Active Reconnaissance is:",
                options: ["Reliable", "Easy to detect", "All of the above", "None"],
                correct: 2,
                explanation: "Active reconnaissance is reliable but easy to detect."
            },
            {
                id: "EH008",
                text: "Footprinting is the process to gain access into an organization's system.",
                options: ["صواب", "خطأ"],
                correct: 1,
                explanation: "Footprinting gathers information; scanning is for gaining access."
            },
            {
                id: "EH009",
                text: "In OSINT websites, searches can be conducted on:",
                options: ["Email addresses", "Domains", "Bitcoin transactions", "All of the above"],
                correct: 3,
                explanation: "OSINT gathers publicly available information from various sources."
            },
            {
                id: "EH010",
                text: "Social engineering refers to techniques aimed at:",
                options: [
                    "Talking a target into revealing information",
                    "Penetration testing",
                    "Hacking systems",
                    "Network scanning"
                ],
                correct: 0,
                explanation: "Social engineering manipulates people into revealing sensitive information."
            },
            {
                id: "EH011",
                text: "DNS cache poisoning causes users to:",
                options: [
                    "Infect webpages with malware",
                    "Travel to malicious websites when entering legitimate URLs",
                    "Follow authorized staff into restricted areas",
                    "See alarming warnings"
                ],
                correct: 1,
                explanation: "DNS cache poisoning redirects users to malicious websites."
            },
            {
                id: "EH012",
                text: "Phishing attacks can be through a call",
                options: ["صواب", "خطأ"],
                correct: 0,
                explanation: "Vishing (voice phishing) is a type of phishing attack."
            },
            {
                id: "EH013",
                text: "Scareware is the only social engineering attack technique",
                options: ["صواب", "خطأ"],
                correct: 1,
                explanation: "Social engineering includes phishing, pretexting, baiting, and others."
            },
            {
                id: "EH014",
                text: "Phishing attacks can be through:",
                options: ["Email", "SMS", "Voice Call", "All of the above"],
                correct: 3,
                explanation: "Phishing can be conducted via email, SMS (smishing), or voice (vishing)."
            },
            {
                id: "EH015",
                text: "By using port scanning you can:",
                options: ["Detect open ports", "Identify services", "None", "All of the above"],
                correct: 3,
                explanation: "Port scanning detects open ports and running services."
            },
            {
                id: "EH016",
                text: "The -sV flag in Nmap is used for:",
                options: ["Service version detection", "Operating system detection", "Port scanning", "Ping sweep"],
                correct: 0,
                explanation: "-sV performs service version detection."
            },
            {
                id: "EH017",
                text: "Wireshark is a:",
                options: ["GUI-based packet capture program", "Command-line tool only", "Vulnerability scanner", "Password cracker"],
                correct: 0,
                explanation: "Wireshark is a GUI-based packet capture and analysis tool."
            },
            {
                id: "EH018",
                text: "The process of sending ARP responses without a corresponding request is called:",
                options: ["gratuitous ARP", "ARP request", "ARP cache", "ARP poisoning"],
                correct: 0,
                explanation: "Gratuitous ARP sends ARP responses without a request."
            },
            {
                id: "EH019",
                text: "EternalBlue is a vulnerability in Microsoft's:",
                options: ["SMB protocol", "HTTP protocol", "FTP protocol", "DNS protocol"],
                correct: 0,
                explanation: "EternalBlue exploits the SMB protocol vulnerability."
            },
            {
                id: "EH020",
                text: "A worm is self-propagating",
                options: ["صواب", "خطأ"],
                correct: 0,
                explanation: "Worms can replicate and spread without user intervention."
            },
            {
                id: "EH021",
                text: "Ransomware is a program that:",
                options: [
                    "Encrypts a portion of a victim's hard drive",
                    "Steals passwords",
                    "Monitors user activity",
                    "Blocks network traffic"
                ],
                correct: 0,
                explanation: "Ransomware encrypts files and demands payment for decryption."
            },
            {
                id: "EH022",
                text: "A dropper is used to:",
                options: [
                    "Install other malware",
                    "Encrypt files",
                    "Steal credentials",
                    "Monitor network traffic"
                ],
                correct: 0,
                explanation: "A dropper installs other malicious software on the system."
            },
            {
                id: "EH023",
                text: "John the Ripper is a common tool used to:",
                options: ["Crack passwords", "Scan ports", "Analyze packets", "Encrypt data"],
                correct: 0,
                explanation: "John the Ripper is a widely-used password cracking tool."
            },
            {
                id: "EH024",
                text: "Incremental mode in John the Ripper:",
                options: [
                    "Tries every possible combination",
                    "Uses a wordlist",
                    "Uses user information",
                    "Uses rainbow tables"
                ],
                correct: 0,
                explanation: "Incremental mode tries every possible character combination."
            },
            {
                id: "EH025",
                text: "A penetration testing report contains:",
                options: [
                    "Analysis of vulnerabilities found",
                    "Marketing strategies",
                    "Employee salaries",
                    "Company financials"
                ],
                correct: 0,
                explanation: "Penetration testing reports document vulnerabilities and recommendations."
            }
        ]
    },

    "CryptographyBasics": {
        title: "🔐 أساسيات التشفير",
        level: 2,
        category: "cryptography",
        description: "أسئلة في مبادئ التشفير والخوارزميات الأمنية",
        totalQuestions: 572,
        questions: [
            {
                id: "CR001",
                text: "In frequency analysis, the attacker looks at ciphertext and analyzes letter frequency",
                options: ["True", "False"],
                correct: 0,
                explanation: "Frequency analysis breaks substitution ciphers by analyzing letter frequencies."
            },
            {
                id: "CR002",
                text: "Caesar cipher uses a random key as long as the message",
                options: ["True", "False"],
                correct: 1,
                explanation: "Caesar cipher uses a fixed shift; One-Time Pad uses a random key."
            },
            {
                id: "CR003",
                text: "What is the primary objective of computer security according to NIST?",
                options: [
                    "Prevent all cyber attacks",
                    "Preserve integrity, availability, and confidentiality",
                    "Ensure physical security only",
                    "Eliminate data storage"
                ],
                correct: 1,
                explanation: "The CIA triad is the foundation of information security."
            },
            {
                id: "CR004",
                text: "Which attack intercepts communications without affecting system resources?",
                options: ["Active attack", "Passive attack", "Fabrication", "Modification"],
                correct: 1,
                explanation: "Passive attacks observe without altering data or resources."
            },
            {
                id: "CR005",
                text: "What is the simplest form of a substitution cipher?",
                options: ["Caesar Cipher", "Vigenère Cipher", "Playfair Cipher", "Hill Cipher"],
                correct: 0,
                explanation: "The Caesar Cipher shifts each letter by a fixed number."
            },
            {
                id: "CR006",
                text: "In Caesar Cipher, shifting each letter by 3 positions means:",
                options: [
                    "Replace with letters 3 positions down",
                    "Replace with letters 3 positions up",
                    "Letters remain unchanged",
                    "Substitute based on keyword"
                ],
                correct: 0,
                explanation: "Shifting by 3 means A→D, B→E, etc."
            },
            {
                id: "CR007",
                text: "Which cipher shifts multiple alphabets using a keyword?",
                options: ["Caesar Cipher", "Monoalphabetic Cipher", "Vigenère Cipher", "Hill Cipher"],
                correct: 2,
                explanation: "Vigenère Cipher is polyalphabetic using a keyword."
            },
            {
                id: "CR008",
                text: "What is a major limitation of the shift cipher?",
                options: [
                    "Too many keys",
                    "Only 25 possible keys, easy to brute force",
                    "Requires complex machinery",
                    "Requires long keyword"
                ],
                correct: 1,
                explanation: "Only 25 possible keys makes it vulnerable to brute force."
            },
            {
                id: "CR009",
                text: "Which is a transposition cipher?",
                options: ["Rail Fence Cipher", "Monoalphabetic Cipher", "Caesar Cipher", "Playfair Cipher"],
                correct: 0,
                explanation: "Rail Fence rearranges character order, making it a transposition cipher."
            },
            {
                id: "CR010",
                text: "Why is One-Time Pad considered unbreakable?",
                options: [
                    "Key used once and as long as message",
                    "Fixed shift for all letters",
                    "Relies on modern computers",
                    "Uses repeated keyword"
                ],
                correct: 0,
                explanation: "Perfect secrecy when key is random, as long as message, and used once."
            },
            {
                id: "CR011",
                text: "Secret Key Cryptography generates ciphertext that looks random to those without the key",
                options: ["True", "False"],
                correct: 0,
                explanation: "Proper encryption produces output indistinguishable from random."
            },
            {
                id: "CR012",
                text: "Stream ciphers process messages in blocks",
                options: ["True", "False"],
                correct: 1,
                explanation: "Stream ciphers process one bit/byte at a time; block ciphers use blocks."
            },
            {
                id: "CR013",
                text: "What is the main difference between block and stream ciphers?",
                options: [
                    "Block processes bytes, stream processes blocks",
                    "Block processes fixed-size blocks, stream processes bits/bytes",
                    "Block uses public keys, stream uses symmetric",
                    "Block is faster than stream"
                ],
                correct: 1,
                explanation: "Block ciphers encrypt fixed-size blocks; stream ciphers encrypt bit-by-bit."
            },
            {
                id: "CR014",
                text: "Which structure is the foundation of most symmetric block ciphers?",
                options: ["Vigenère", "Monoalphabetic", "Feistel Cipher", "Caesar"],
                correct: 2,
                explanation: "Feistel structure is used in DES and many other block ciphers."
            },
            {
                id: "CR015",
                text: "What is the purpose of initial permutation (IP) in DES?",
                options: [
                    "Encrypt data directly",
                    "Reorder input bits for processing",
                    "Generate subkeys",
                    "Compress plaintext"
                ],
                correct: 1,
                explanation: "Initial permutation reorders bits before processing."
            },
            {
                id: "CR016",
                text: "How many bits are used in the DES key?",
                options: ["256 bits", "56 bits + 8 parity", "128 bits + 8 parity", "32 bits"],
                correct: 1,
                explanation: "DES uses 56 bits for encryption plus 8 parity bits."
            },
            {
                id: "CR017",
                text: "Why is DES considered insecure today?",
                options: [
                    "Key length too short for brute force",
                    "Weak algorithm",
                    "Cannot be hardware implemented",
                    "Too much computation"
                ],
                correct: 0,
                explanation: "56-bit key is vulnerable to brute-force attacks."
            },
            {
                id: "CR018",
                text: "What ensures diffusion in a block cipher?",
                options: ["Substitution only", "Substitution and permutation", "Hashing", "Key exchange"],
                correct: 1,
                explanation: "Both substitution and permutation provide diffusion."
            },
            {
                id: "CR019",
                text: "What is the avalanche effect?",
                options: [
                    "Identical output for similar inputs",
                    "Small input change causes significant output change",
                    "Method to increase speed",
                    "Attack method to decrypt"
                ],
                correct: 1,
                explanation: "Avalanche effect spreads small changes throughout output."
            },
            {
                id: "CR020",
                text: "RSA is an algorithm that uses symmetric key encryption",
                options: ["True", "False"],
                correct: 1,
                explanation: "RSA is asymmetric, using public/private key pairs."
            },
            {
                id: "CR021",
                text: "What is the primary difference between asymmetric and symmetric encryption?",
                options: [
                    "Asymmetric uses key pairs, symmetric uses one key",
                    "Asymmetric is faster",
                    "Symmetric requires more resources",
                    "Both use same key"
                ],
                correct: 0,
                explanation: "Asymmetric uses public/private keys; symmetric uses one shared key."
            },
            {
                id: "CR022",
                text: "Which algorithm is most associated with asymmetric encryption?",
                options: ["DES", "RSA", "AES", "Caesar"],
                correct: 1,
                explanation: "RSA is the most common asymmetric encryption algorithm."
            },
            {
                id: "CR023",
                text: "What is a one-way function in public-key cryptography?",
                options: [
                    "Easy one direction, hard to reverse without info",
                    "Converts plaintext to bits",
                    "Reversible encryption",
                    "Used only for hashing"
                ],
                correct: 0,
                explanation: "One-way functions are easy to compute but hard to reverse."
            },
            {
                id: "CR024",
                text: "Which protocol is used for secure key exchange in asymmetric encryption?",
                options: ["RSA", "AES", "Diffie-Hellman", "DES"],
                correct: 2,
                explanation: "Diffie-Hellman enables secure key exchange over insecure channels."
            },
            {
                id: "CR025",
                text: "What does a hash function do?",
                options: [
                    "Encrypts data",
                    "Converts data to fixed-size output",
                    "Compresses files",
                    "Generates random numbers"
                ],
                correct: 1,
                explanation: "Hash functions produce fixed-size outputs for integrity checks."
            }
        ]
    },

    "CyberThreats": {
        title: "⚠️ التهديدات السيبرانية",
        level: 4,
        category: "threats",
        description: "أسئلة في أنواع التهديدات والهجمات السيبرانية",
        totalQuestions: 806,
        questions: [
            {
                id: "CT001",
                text: "Interception is an attack on:",
                options: ["Integrity", "Confidentiality", "Availability", "Authenticity"],
                correct: 1,
                explanation: "Interception targets confidentiality via unauthorized access."
            },
            {
                id: "CT002",
                text: "An attack on availability is classified as:",
                options: ["Fabrication", "Interception", "Interruption", "Modification"],
                correct: 2,
                explanation: "Interruption affects availability of data or services."
            },
            {
                id: "CT003",
                text: "Which is a type of passive attack?",
                options: ["Denial of service", "Replay", "Modification", "Traffic analysis"],
                correct: 3,
                explanation: "Traffic analysis observes patterns without altering data."
            },
            {
                id: "CT004",
                text: "A flaw or weakness in a computer system is definition of:",
                options: ["Mitigation tactic", "Attacker", "Vulnerability", "Threat"],
                correct: 2,
                explanation: "A vulnerability is a weakness that can be exploited."
            },
            {
                id: "CT005",
                text: "What type of malware infects by receiving a document like an invoice?",
                options: ["Backdoors", "Virus", "Worm", "Trojan"],
                correct: 3,
                explanation: "Trojans disguise as legitimate files like invoices."
            },
            {
                id: "CT006",
                text: "A botnet is:",
                options: [
                    "Collection of infected endpoints",
                    "Type of antivirus",
                    "Encryption method",
                    "Firewall configuration"
                ],
                correct: 0,
                explanation: "A botnet is a network of infected devices controlled by attackers."
            },
            {
                id: "CT007",
                text: "Which malware can identify and copy itself into programs?",
                options: ["Trojan", "Backdoor", "Virus", "Worm"],
                correct: 2,
                explanation: "Viruses replicate by inserting code into other programs."
            },
            {
                id: "CT008",
                text: "All backdoors are for illegitimate purposes",
                options: ["True", "False"],
                correct: 1,
                explanation: "Some backdoors are legitimate for debugging or support."
            },
            {
                id: "CT009",
                text: "WannaCry is an example of:",
                options: ["Dropper", "Ransomware", "Trojan", "Backdoor"],
                correct: 1,
                explanation: "WannaCry encrypts files and demands ransom payment."
            },
            {
                id: "CT010",
                text: "Social engineering principle when people queue for free USB sticks:",
                options: ["Authority", "Reciprocity", "Social proof", "Scarcity"],
                correct: 2,
                explanation: "Social proof uses the behavior of others to influence."
            },
            {
                id: "CT011",
                text: "Tailgating is a physical security breach where:",
                options: [
                    "Attacker follows authorized person into restricted area",
                    "Attacker sends phishing emails",
                    "Attacker leaves infected USB drives",
                    "Attacker creates fake Wi-Fi"
                ],
                correct: 0,
                explanation: "Tailgating involves following an authorized individual into a secure area."
            },
            {
                id: "CT012",
                text: "What is the goal of a de-authentication attack?",
                options: [
                    "Forcing stations to reauthenticate",
                    "Downgrading encryption",
                    "Reducing handshake steps",
                    "Disabling stations"
                ],
                correct: 0,
                explanation: "De-authentication forces reauthentication to capture credentials."
            },
            {
                id: "CT013",
                text: "Digital forensics is the same as data recovery",
                options: ["True", "False"],
                correct: 1,
                explanation: "Forensics involves investigation for legal purposes, not just recovery."
            },
            {
                id: "CT014",
                text: "Indicators of compromise are:",
                options: [
                    "Artifacts indicating potential breach",
                    "Data recovery process",
                    "Encryption algorithms",
                    "Firewall rules"
                ],
                correct: 0,
                explanation: "IoCs are observable artifacts that suggest a security breach."
            },
            {
                id: "CT015",
                text: "Cross-site scripting (XSS) injects code into:",
                options: [
                    "Input fields to execute in browser",
                    "Database queries",
                    "Server configuration",
                    "Network packets"
                ],
                correct: 0,
                explanation: "XSS injects malicious scripts into web pages viewed by users."
            },
            {
                id: "CT016",
                text: "Persistent XSS stores malicious script:",
                options: [
                    "On the server",
                    "In the browser cache",
                    "In URL parameters",
                    "In HTTP headers"
                ],
                correct: 0,
                explanation: "Persistent XSS stores the malicious script on the server."
            },
            {
                id: "CT017",
                text: "SQL injection attacks target:",
                options: ["Web browsers", "Database servers", "Email servers", "DNS servers"],
                correct: 1,
                explanation: "SQL injection manipulates database queries via user input."
            },
            {
                id: "CT018",
                text: "SaaS provides:",
                options: [
                    "Physical and virtual servers",
                    "Software applications over internet",
                    "Storage and networking",
                    "Development platforms"
                ],
                correct: 1,
                explanation: "SaaS delivers software applications over the internet."
            },
            {
                id: "CT019",
                text: "Cryptanalytic attacks exploit algorithm characteristics to:",
                options: [
                    "Deduce plaintext or key",
                    "Encrypt faster",
                    "Compress data",
                    "Authenticate users"
                ],
                correct: 0,
                explanation: "Cryptanalysis recovers plaintext or keys through algorithmic weaknesses."
            },
            {
                id: "CT020",
                text: "Public-key encryption is also known as:",
                options: ["Symmetric encryption", "Asymmetric encryption", "Digital encryption", "One-time encryption"],
                correct: 1,
                explanation: "Public-key encryption uses different keys for encryption and decryption."
            }
        ]
    },

    "DigitalForensics": {
        title: "🔍 التحقيق الجنائي الرقمي",
        level: 4,
        category: "forensics",
        description: "أسئلة في جمع وتحليل الأدلة الرقمية",
        totalQuestions: 230,
        questions: [
            {
                id: "DF001",
                text: "What is the main function of write-blockers in digital forensics?",
                options: [
                    "Boost forensic tools efficiency",
                    "Stop unauthorized network access",
                    "Preserve original data by preventing modifications",
                    "Obstruct malware operations"
                ],
                correct: 2,
                explanation: "Write-blockers prevent modifications to storage devices during analysis."
            },
            {
                id: "DF002",
                text: "Creating a forensic image requires physically altering the device's hardware",
                options: ["True", "False"],
                correct: 1,
                explanation: "Forensic imaging copies data without modifying original hardware."
            },
            {
                id: "DF003",
                text: "What function does computer forensics serve in cybersecurity?",
                options: [
                    "Solely for data recovery",
                    "No judicial significance",
                    "Safeguarding against and scrutinizing cyber misdemeanors",
                    "Exclusive to academia"
                ],
                correct: 2,
                explanation: "Forensics supports investigating and preventing cybercrimes."
            },
            {
                id: "DF004",
                text: "Why is chain of custody crucial in digital forensics?",
                options: [
                    "Ensures efficient storage",
                    "Tracks evidence handling for authenticity",
                    "Only for digital law",
                    "Minimizes investigation expenses"
                ],
                correct: 1,
                explanation: "Chain of custody documents who handled evidence and when."
            },
            {
                id: "DF005",
                text: "During which step is digital evidence examined for patterns?",
                options: ["Data collection", "Examination", "Compilation", "Preparation"],
                correct: 1,
                explanation: "Examination analyzes data for anomalies or patterns."
            },
            {
                id: "DF006",
                text: "Define a 'forensic image':",
                options: [
                    "Scene incident image",
                    "Graphic representation",
                    "Precise duplicate of all data from storage",
                    "Network flow diagram"
                ],
                correct: 2,
                explanation: "A forensic image is a bit-by-bit copy of storage data."
            },
            {
                id: "DF007",
                text: "Digital forensics is only applicable to cybercrimes, not civil litigation",
                options: ["True", "False"],
                correct: 1,
                explanation: "Forensics is also used in civil cases like fraud investigations."
            },
            {
                id: "DF008",
                text: "Which ISO standard provides guidelines for handling digital evidence?",
                options: ["ISO 9001", "ISO 27037", "ISO 14001", "ISO 31000"],
                correct: 1,
                explanation: "ISO 27037 defines digital evidence handling best practices."
            },
            {
                id: "DF009",
                text: "What is the role of a Digital Evidence First Responder (DEFR)?",
                options: [
                    "Prosecute cases",
                    "Analyze evidence",
                    "Collect evidence as specified in warrant",
                    "Repair damaged devices"
                ],
                correct: 2,
                explanation: "DEFR properly collects digital evidence following legal protocols."
            },
            {
                id: "DF010",
                text: "Live data acquisition is unnecessary if static data is collected",
                options: ["True", "False"],
                correct: 1,
                explanation: "Live acquisition captures volatile data lost when powered down."
            },
            {
                id: "DF011",
                text: "Which method captures data that could be lost upon system shutdown?",
                options: ["Static acquisition", "Manual acquisition", "Live acquisition", "Logical acquisition"],
                correct: 2,
                explanation: "Live acquisition captures RAM contents and active connections."
            },
            {
                id: "DF012",
                text: "Hashing algorithms validate digital evidence by:",
                options: [
                    "Manual inspection",
                    "Using hash algorithms",
                    "Comparing sizes",
                    "Witness testimony"
                ],
                correct: 1,
                explanation: "Hash algorithms ensure evidence integrity during acquisition."
            },
            {
                id: "DF013",
                text: "What is the primary goal of forensic data acquisition?",
                options: [
                    "Modify data for analysis",
                    "Collect evidence in original form",
                    "Prioritize by size",
                    "Analyze immediately"
                ],
                correct: 1,
                explanation: "Goal is collecting data in forensically sound manner without alteration."
            },
            {
                id: "DF014",
                text: "What role does password recovery play in digital forensics?",
                options: [
                    "Essential for accessing protected data",
                    "Only for personal passwords",
                    "Minor and rarely needed",
                    "Educational only"
                ],
                correct: 0,
                explanation: "Password recovery accesses encrypted or protected data."
            },
            {
                id: "DF015",
                text: "SIM cards contain valuable information for forensic investigations",
                options: ["True", "False"],
                correct: 0,
                explanation: "SIM cards store contacts, SMS, and location data."
            },
            {
                id: "DF016",
                text: "Mobile device forensics can provide user location history",
                options: ["True", "False"],
                correct: 0,
                explanation: "GPS logs and network connections reveal location history."
            },
            {
                id: "DF017",
                text: "What does Windows Registry analysis reveal?",
                options: [
                    "User preferences and installed apps",
                    "System performance only",
                    "File organization",
                    "Corrupted files"
                ],
                correct: 0,
                explanation: "Registry stores user habits, installed apps, and configurations."
            },
            {
                id: "DF018",
                text: "Prefetch files in Windows show:",
                options: [
                    "Last backup time",
                    "When and how often apps were used",
                    "IP configurations",
                    "USB activity"
                ],
                correct: 1,
                explanation: "Prefetch files log application execution history."
            },
            {
                id: "DF019",
                text: "What is volatile data in Windows forensics?",
                options: [
                    "Installed applications",
                    "Browser history",
                    "USB device history",
                    "Data in RAM about logged-on users"
                ],
                correct: 3,
                explanation: "Volatile data disappears after system shutdown."
            },
            {
                id: "DF020",
                text: "What is the primary purpose of forensic reports?",
                options: [
                    "Communicate investigation outcomes",
                    "Detail tool specifications",
                    "List all software used",
                    "Provide terminology database"
                ],
                correct: 0,
                explanation: "Forensic reports present findings clearly and understandably."
            }
        ]
    },

    "WebApplicationSecurity": {
        title: "🌐 أمن تطبيقات الويب",
        level: 4,
        category: "web_security",
        description: "أسئلة في حماية تطبيقات الويب والثغرات الأمنية",
        totalQuestions: 660,
        questions: [
            {
                id: "WS001",
                text: "What can XML elements contain?",
                options: ["Only text", "Text, attributes, and other elements", "Images and videos", "Server-side code"],
                correct: 1,
                explanation: "XML elements can contain text, attributes, and other elements."
            },
            {
                id: "WS002",
                text: "In HTTP/2, what type of connection is used?",
                options: ["TCP/IP connection", "UDP connection", "WebSocket connection", "FTP connection"],
                correct: 0,
                explanation: "HTTP/2 uses a single, persistent TCP connection."
            },
            {
                id: "WS003",
                text: "How are HTTP verbs used in REST APIs?",
                options: [
                    "To perform server-side logic",
                    "To define API structure",
                    "To make requests for resources",
                    "To specify programming language"
                ],
                correct: 2,
                explanation: "HTTP verbs like GET, POST, PUT, DELETE request or manipulate resources."
            },
            {
                id: "WS004",
                text: "What is the attack surface of a system?",
                options: [
                    "Area where attacks originate",
                    "Number of attackers",
                    "Ways unauthorized could enter system",
                    "Server surface area"
                ],
                correct: 2,
                explanation: "Attack surface includes all potential entry points for attackers."
            },
            {
                id: "WS005",
                text: "When should you validate input in a web application?",
                options: [
                    "At request end",
                    "Before sending response",
                    "Both as it arrives and before usage",
                    "Only on error"
                ],
                correct: 2,
                explanation: "Input should be validated early and before usage to prevent injection."
            },
            {
                id: "WS006",
                text: "What is the primary security principle for input validation?",
                options: [
                    "Always trust the user",
                    "Validate only client-side",
                    "Never trust the user",
                    "Use blacklist validation"
                ],
                correct: 2,
                explanation: "'Never trust the user' ensures all inputs are validated."
            },
            {
                id: "WS007",
                text: "What is the main goal of Cross-Site Scripting (XSS) attacks?",
                options: [
                    "Physical server access",
                    "Manipulate server logs",
                    "Change how users interact with vulnerable program",
                    "Exploit DNS vulnerabilities"
                ],
                correct: 2,
                explanation: "XSS injects malicious scripts to manipulate user interactions."
            },
            {
                id: "WS008",
                text: "When do Security Misconfigurations commonly occur?",
                options: [
                    "During development",
                    "When security options optimized",
                    "When default settings secure",
                    "In any computer, software, or network"
                ],
                correct: 3,
                explanation: "Misconfigurations occur due to incorrect default settings."
            },
            {
                id: "WS009",
                text: "What is the primary purpose of threat modeling in SDL?",
                options: [
                    "Identifying vulnerabilities",
                    "Evaluating potential threats and vulnerabilities",
                    "Developing architecture",
                    "Testing for flaws"
                ],
                correct: 1,
                explanation: "Threat modeling evaluates potential threats for secure design."
            },
            {
                id: "WS010",
                text: "How can you defend against XML External Entity (XXE) attacks?",
                options: [
                    "Enable External Entity Processing",
                    "Set DOCTYPE to on",
                    "Disable External Entity Processing",
                    "Ignore XML input"
                ],
                correct: 2,
                explanation: "Disabling external entity processing in XML parsers prevents XXE."
            },
            {
                id: "WS011",
                text: "What do CSRF attacks trick users into doing?",
                options: [
                    "Downloading malicious files",
                    "Logging out",
                    "Performing actions on another site without consent",
                    "Injecting JavaScript"
                ],
                correct: 2,
                explanation: "CSRF tricks authenticated users into performing unauthorized actions."
            },
            {
                id: "WS012",
                text: "What is the primary goal of Denial of Service (DoS) attacks?",
                options: [
                    "Steal user data",
                    "Make website faster",
                    "Overwhelm application causing unavailability",
                    "Improve network performance"
                ],
                correct: 2,
                explanation: "DoS attacks overload services, making them unavailable."
            },
            {
                id: "WS013",
                text: "What does a Content Delivery Network (CDN) do against DDoS attacks?",
                options: [
                    "Absorbs traffic slowly",
                    "Distributes and absorbs traffic to protect infrastructure",
                    "Blocks all traffic",
                    "Encrypts incoming traffic"
                ],
                correct: 1,
                explanation: "CDNs absorb and distribute traffic, protecting origin servers."
            },
            {
                id: "WS014",
                text: "Which attribute on cookies can be set to restrict sharing across sites?",
                options: ["Secure", "HttpOnly", "SameSite", "CrossOrigin"],
                correct: 2,
                explanation: "SameSite prevents cross-site cookie access, mitigating CSRF."
            },
            {
                id: "WS015",
                text: "What is the primary purpose of input validation in defending against XXE?",
                options: [
                    "Prevent CSRF",
                    "Ensure XML adheres to expected structure",
                    "Inject malicious code",
                    "Encrypt XML data"
                ],
                correct: 1,
                explanation: "Input validation ensures data integrity and prevents malicious content."
            }
        ]
    },

    "OperatingSystems": {
        title: "💻 نظم التشغيل",
        level: 2,
        category: "os",
        description: "أسئلة في مفاهيم نظم التشغيل وإدارة الموارد",
        totalQuestions: 400,
        questions: [
            {
                id: "OS001",
                text: "CPU-bound processes are more likely to have nonvoluntary context switches",
                options: ["True", "False"],
                correct: 0,
                explanation: "CPU-bound jobs trigger nonvoluntary context switches more frequently."
            },
            {
                id: "OS002",
                text: "I/O-bound processes are more likely to have voluntary context switches",
                options: ["True", "False"],
                correct: 0,
                explanation: "I/O-bound processes yield voluntarily when waiting for I/O."
            },
            {
                id: "OS003",
                text: "In what way is an operating system like a government?",
                options: [
                    "Seldom functions correctly",
                    "Creates environment for other programs to work",
                    "Performs useful functions by itself",
                    "Concerned primarily with individual needs"
                ],
                correct: 1,
                explanation: "OS manages resources so programs can function."
            },
            {
                id: "OS004",
                text: "What is the degree of multiprogramming?",
                options: ["Process count", "Long-term scheduler", "Number of processes in memory", "CPU scheduler"],
                correct: 2,
                explanation: "Degree of multiprogramming tracks processes loaded in memory."
            },
            {
                id: "OS005",
                text: "Which statement is true about IPC?",
                options: [
                    "Shared memory is faster than message passing",
                    "Message passing is faster than shared memory",
                    "Message passing is best for large data",
                    "Shared memory is more common"
                ],
                correct: 0,
                explanation: "Shared memory allows direct communication, making it faster."
            },
            {
                id: "OS006",
                text: "Which technology reduces overhead for bulk data movement?",
                options: ["Direct Memory Access (DMA)", "NUMA", "SMP", "SAN"],
                correct: 0,
                explanation: "DMA transfers data without CPU intervention."
            },
            {
                id: "OS007",
                text: "The stack of a process contains:",
                options: [
                    "Text section",
                    "Data section",
                    "Program counter",
                    "Temporary data, parameters, return addresses"
                ],
                correct: 3,
                explanation: "The stack stores function frames, locals, and return addresses."
            },
            {
                id: "OS008",
                text: "The principal objective of Batch Multiprogramming is to minimize response time",
                options: ["True", "False"],
                correct: 1,
                explanation: "Batch multiprogramming maximizes throughput, not response time."
            },
            {
                id: "OS009",
                text: "Which is loosely coupled?",
                options: ["Multiprocessor systems", "Single-processor", "Multi-core", "Clustered system"],
                correct: 3,
                explanation: "Clustered systems link machines via network, loosely coupled."
            },
            {
                id: "OS010",
                text: "A monolithic kernel runs all services in a single address space",
                options: ["True", "False"],
                correct: 0,
                explanation: "Monolithic kernels run all services in kernel space."
            },
            {
                id: "OS011",
                text: "What is the purpose of a context switch?",
                options: [
                    "Save process state",
                    "Allocate memory",
                    "Switch between foreground/background",
                    "Terminate process"
                ],
                correct: 0,
                explanation: "Context switch saves state to resume later."
            },
            {
                id: "OS012",
                text: "First-Come, First-Served (FCFS) scheduling can cause short processes to wait for long ones",
                options: ["True", "False"],
                correct: 0,
                explanation: "FCFS experiences convoy effect delaying short jobs."
            },
            {
                id: "OS013",
                text: "Which scheduling algorithm could result in starvation?",
                options: ["FCFS", "SJF", "Round Robin", "Priority"],
                correct: 3,
                explanation: "Low-priority tasks may never execute under priority scheduling."
            },
            {
                id: "OS014",
                text: "Shortest-job-first (SJF) scheduling is provably optimal for average waiting time",
                options: ["True", "False"],
                correct: 0,
                explanation: "SJF minimizes waiting time mathematically."
            },
            {
                id: "OS015",
                text: "What is thrashing?",
                options: [
                    "High CPU utilization",
                    "Process constantly swapping pages",
                    "Efficient memory usage",
                    "Excessive disk space"
                ],
                correct: 1,
                explanation: "Thrashing occurs when excessive paging harms performance."
            },
            {
                id: "OS016",
                text: "A translation-look-aside buffer (TLB) caches page table entries",
                options: ["True", "False"],
                correct: 0,
                explanation: "TLB caches recent virtual-to-physical translations."
            },
            {
                id: "OS017",
                text: "What is Belady's Anomaly?",
                options: [
                    "More frames lead to fewer faults",
                    "More frames lead to more faults",
                    "Increased CPU utilization",
                    "Faster memory access"
                ],
                correct: 1,
                explanation: "Increasing frames may increase page faults in FIFO."
            },
            {
                id: "OS018",
                text: "Which page replacement replaces the least recently used page?",
                options: ["FIFO", "LRU", "OPT", "Random"],
                correct: 1,
                explanation: "LRU replaces the least recently used page."
            },
            {
                id: "OS019",
                text: "What is the benefit of virtual memory?",
                options: [
                    "Programs larger than physical memory",
                    "Processes share memory",
                    "Efficient process creation",
                    "All of the above"
                ],
                correct: 3,
                explanation: "Virtual memory provides all these benefits."
            },
            {
                id: "OS020",
                text: "Semaphores can be used to provide mutual exclusion",
                options: ["True", "False"],
                correct: 0,
                explanation: "Semaphores can enforce exclusive access to resources."
            }
        ]
    },

    "RiskAnalysis": {
        title: "📊 تحليل المخاطر السيبرانية",
        level: 3,
        category: "risk",
        description: "أسئلة في تقييم وإدارة المخاطر الأمنية",
        totalQuestions: 312,
        questions: [
            {
                id: "RA001",
                text: "What are some major information security risk assessment frameworks?",
                options: ["HIPAA", "OCTAVE", "FAIR", "NIST SP800-30"],
                correct: 0,
                explanation: "HIPAA is a healthcare-specific framework."
            },
            {
                id: "RA002",
                text: "What is the difference between uncertainty and risk according to Frank Knight?",
                options: [
                    "Uncertainty = limited knowledge, Risk = measurement of uncertainty",
                    "Uncertainty = not knowing, Risk = exposure to harm",
                    "Uncertainty = situation exposing to harm, Risk = probability",
                    "Uncertainty = future event, Risk = impact"
                ],
                correct: 0,
                explanation: "Uncertainty cannot be measured; risk involves measurable probabilities."
            },
            {
                id: "RA003",
                text: "What are advantages of using a formal risk assessment framework?",
                options: [
                    "Consistent and repeatable process",
                    "All answers are right",
                    "Communicate risks to stakeholders",
                    "Align security with business objectives"
                ],
                correct: 1,
                explanation: "Formal frameworks provide structure, communication, and alignment."
            },
            {
                id: "RA004",
                text: "What are the three important concepts in information security risk?",
                options: [
                    "Risk, uncertainty, measurement",
                    "Threat, vulnerability, impact",
                    "Event, asset, outcome",
                    "Probability, exposure, frequency"
                ],
                correct: 1,
                explanation: "Risk revolves around threats, vulnerabilities, and impacts."
            },
            {
                id: "RA005",
                text: "What is the main goal of an information security risk assessment?",
                options: [
                    "Identify and assess risks to CIA",
                    "Implement security controls",
                    "Measure control performance",
                    "Comply with regulations"
                ],
                correct: 0,
                explanation: "Primary goal is evaluating threats and vulnerabilities."
            },
            {
                id: "RA006",
                text: "What are the three main steps of risk assessment?",
                options: [
                    "Identification, analysis, treatment",
                    "Planning, monitoring, control",
                    "Assessment, mitigation, acceptance",
                    "Context, sources, consequences"
                ],
                correct: 0,
                explanation: "Standard steps: identify, analyze, determine treatments."
            },
            {
                id: "RA007",
                text: "FAIR distinguishes between which two risk factors?",
                options: [
                    "Loss event frequency and magnitude",
                    "Threat frequency and vulnerability",
                    "Control strength and resistance",
                    "Primary and secondary loss"
                ],
                correct: 0,
                explanation: "FAIR uses loss event frequency and loss magnitude."
            },
            {
                id: "RA008",
                text: "What is often overlooked in risk assessments?",
                options: [
                    "Regulatory compliance",
                    "Strategic alignment with organizational goals",
                    "Technical vulnerabilities",
                    "Incident documentation"
                ],
                correct: 1,
                explanation: "Strategic alignment ensures assessments support organizational mission."
            },
            {
                id: "RA009",
                text: "What determines the size of the risk assessment project team?",
                options: [
                    "Number of IT directors",
                    "Annual revenue",
                    "Complexity and scope of assessment",
                    "Number of IT assets"
                ],
                correct: 2,
                explanation: "Larger scope requires more personnel with diverse expertise."
            },
            {
                id: "RA010",
                text: "What is the primary goal of compiling an IT asset inventory?",
                options: [
                    "List IT employees",
                    "Identify IT assets supporting business processes",
                    "Track hardware replacement",
                    "List software licenses"
                ],
                correct: 1,
                explanation: "Asset inventory helps evaluate risks to critical infrastructure."
            },
            {
                id: "RA011",
                text: "What formula is commonly used to compute likelihood in risk assessment?",
                options: [
                    "Likelihood = (Exposure + Frequency) * Control",
                    "Likelihood = (Exposure + Frequency) / Control",
                    "Likelihood = (Exposure + Frequency) * (1/Control)",
                    "Likelihood = (Exposure + Frequency) / (1/Control)"
                ],
                correct: 2,
                explanation: "Formula incorporates the inverse of control strength."
            },
            {
                id: "RA012",
                text: "What is the purpose of classifying threats when reviewing system risk?",
                options: [
                    "Confuse assessors",
                    "Identify most critical threats",
                    "Hide vulnerabilities",
                    "Increase complexity"
                ],
                correct: 1,
                explanation: "Classification helps focus resources on highest risks."
            },
            {
                id: "RA013",
                text: "What is the purpose of categorizing risks into HIGH, MEDIUM, LOW?",
                options: [
                    "Prioritize risks for remediation",
                    "Exclude LOW risks",
                    "Create confusion",
                    "Determine exact likelihood"
                ],
                correct: 0,
                explanation: "Categorization helps prioritize and allocate resources."
            },
            {
                id: "RA014",
                text: "What is the purpose of an Issues Register in risk assessment?",
                options: [
                    "Create confusion",
                    "Track risks and potential impact",
                    "Assess complexity",
                    "Generate regulatory reports"
                ],
                correct: 1,
                explanation: "Issues Register monitors and manages identified risks."
            },
            {
                id: "RA015",
                text: "Risk = impact * likelihood of occurrence",
                options: ["True", "False"],
                correct: 0,
                explanation: "Risk is calculated as Impact × Likelihood."
            }
        ]
    }
};

// تصدير للاستخدام في وحدات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TVTC_QUESTIONS };
}
