// app.js - Main application logic for the Chord Practice Program

// Application state
let appState = {
    currentScreen: 'welcome',
    selectedMode: null,
    selectedChordCategory: 'random',
    currentChord: null,
    neighborsDisplayed: false,
    currentChordWithNeighbors: null,
    chordGenerated: false,        // Whether a chord has been generated
    chordDisplayed: false,        // Whether the chord is currently displayed
    pendingChord: null            // Chord that's generated but not yet displayed
};

// Simple test to see if JavaScript is working
console.log('🧪 JavaScript is working - app state initialized');

// Define valid key names based on our classification
const validKeys = [
    // Sharp keys (use sharps in chord symbols)
    'C', 'G', 'D', 'A', 'E', 'B', 'F#',
    // Flat keys (use flats in chord symbols)  
    'F', 'Bb', 'Eb', 'Ab', 'Db'
];

// Pitch mapping for transposition - matching BPP web version
const pitchClasses = {
    "C": 0, "Db": 1, "C#": 1, "D": 2, "Eb": 3, "D#": 3, "E": 4,
    "F": 5, "Gb": 6, "F#": 6, "G": 7, "Ab": 8, "G#": 8, "A": 9,
    "Bb": 10, "A#": 10, "B": 11
};

// Chord voicings in C (from bottom to top)
const chordVoicings = {
    'II': {
        'CII6': ['G3', 'C4', 'E4', 'A4'],
        'CII#11': ['G3', 'C4', 'E4', 'F#4'],
        'CII13': ['C4', 'E4', 'A4', 'Bb4'],
        'CII#9': ['Eb2', 'G2', 'C3', 'E3']
    },
    'III': {
        'CIII-7': ['Bb4', 'C5', 'Eb5', 'G5', '|', 'B5'],
        'CIII-9': ['Bb4', 'C5', 'Eb5', 'G5', '|', 'B5', 'D6'],
        'CIII-9(#11)': ['Bb4', 'C5', 'Eb5', 'G5', '|', 'B5', 'D6', 'F#6'],
        'CIII7': ['G4', 'Bb4', 'C5', 'E5', '|', 'G#5'],
        'CIII7/Δ7': ['G4', 'Bb4', 'C5', 'E5', '|', 'G#5', 'B5'],
        'CIII7/Δ7/#9': ['G4', 'Bb4', 'C5', 'E5', '|', 'G#5', 'B5', 'D#6'],
        'CIIIø7': ['C5', 'Eb5', 'Gb5', 'Bb5', '|', 'D6'],
        'CIIIø7b13': ['C5', 'Eb5', 'Gb5', 'Bb5', '|', 'D6', 'G#6'],
        'CIIIø7b13(♮3)': ['C5', 'Eb5', 'Gb5', 'Bb5', '|', 'D6', 'E6', 'G#6']
    },
    'AD': {
        'CAD1': ['C3', 'D3', 'F3', 'G3','|', 'Bb3',  'E4', 'A4'],
        'CAD5': ['F2', 'G2', 'Bb2', 'D3', '|', 'E3', 'A3', 'C4']
    }
};

// Complete AD chord voicings for all 12 keys
const adChordVoicings = {
    'AD1': {
        'C': ['C3', 'D3', 'F3', 'G3', '|','Bb3', 'E4', 'A4'],
        'Db': ['Db3', 'Eb3', 'Gb3', 'Ab3', '|','B3', 'F4', 'Bb4'],
        'D': ['D3', 'E3', 'G3', 'A3', '|','C4', 'F#4', 'B4'],
        'Eb': ['Eb3', 'F3', 'Ab3', 'Bb3','|', 'Db4', 'G4', 'C5'],
        'E': ['E3', 'F#3', 'A3', 'B3','|', 'D#4', 'G#4', 'C#5'],
        'F': ['F3', 'G3', 'Bb3', 'C4','|', 'Eb4', 'A4', 'D5'],
        'F#': ['F#3', 'G#3', 'B3', 'C#4', '|','E4', 'A#4', 'D#5'],
        'G': ['G2', 'A2', 'C3', 'D3', '|','F3', 'B3', 'E4'],
        'Ab': ['Ab2', 'Bb2', 'Db3', 'Eb3', '|','Gb3', 'C4', 'F4'],
        'A': ['A2', 'B2', 'D3', 'E3', '|','G3', 'C#4', 'F#4'],
        'Bb': ['Bb2', 'C3', 'Eb3', 'F3','|', 'Ab3', 'D4', 'G4'],
        'B': ['B2', 'C#3', 'E3', 'F#3','|', 'A3', 'D#4', 'G#4']
    },
    'AD5': {
        'F': ['Bb2', 'C3', 'Eb3', 'G3', '|', 'A3', 'D4', 'F4'],
        'F#': ['B2', 'C#3', 'E3', 'G#3', '|', 'A#3', 'D#4', 'F#4'],
        'G': ['C2', 'D2', 'F2', 'A2', '|', 'B2', 'E3', 'G3'],
        'Ab': ['Db2', 'Eb2', 'Gb2', 'Bb2', '|', 'C3', 'F3', 'Ab3'],
        'A': ['D2', 'E2', 'G2', 'B2', '|', 'C#3', 'F#3', 'A3'],
        'Bb': ['Eb2', 'F2', 'Ab2', 'C3', '|', 'D3', 'G3', 'Bb3'],
        'B': ['E2', 'F#2', 'A2', 'C#3', '|', 'D#3', 'G#3', 'B3'],
        'C': ['F2', 'G2', 'Bb2', 'D3', '|', 'E3', 'A3', 'C4'],
        'Db': ['F#2', 'G#2', 'B2', 'D#3', '|', 'F3', 'Bb3', 'Db4'],
        'D': ['G2', 'A2', 'C3', 'E3', '|', 'F#3', 'B3', 'D4'],
        'Eb': ['Ab2', 'Bb2', 'Db3', 'F3', '|', 'G3', 'C4', 'Eb4'],
        'E': ['A2', 'B2', 'D3', 'F#3', '|', 'G#3', 'C#4', 'E4']
    }
};

const modeIIChords = [
    'CII6',
    'CII#11',
    'CII13',
    'CII#9'
];

const modeIIIChords = [
    'CIII-7',
    'CIII-9',
    'CIII-9(#11)',
    'CIII7',
    'CIII7/Δ7',
    'CIII7/Δ7/#9',
    'CIIIø7',
    'CIIIø7b13',
    'CIIIø7b13(♮3)'
];

const modeADChords = [
    'AD1',
    'AD5'
];

// Mode II neighbor arrays for each transposition
const modeIINeighbors = {
    1: {
        '#11': ['CII#11', 'AII13', 'EbII#11', 'CII13', 'F#II#11', 'EbII13', 'AII#11', 'F#II13'],
        '6': ['CII6', 'F#II#9', 'EbII6', 'AII#9', 'F#II6', 'CII#9', 'AII6', 'EbII#9']
    },
    2: {
        '#11': ['DbII#11', 'BbII13', 'EII#11', 'DbII13', 'GII#11', 'EII13', 'BbII#11', 'GII13'],
        '6': ['DbII6', 'GII#9', 'EII6', 'BbII#9', 'GII6', 'DbII#9', 'BbII6', 'EII#9']
    },
    3: {
        '#11': ['DII#11', 'BII13', 'FII#11', 'DII13', 'AbII#11', 'FII13', 'BII#11', 'AbII13'],
        '6': ['DII6', 'AbII#9', 'FII6', 'BII#9', 'AbII6', 'DII#9', 'BII6', 'FII#9']
    }
};

// Mode III neighbor arrays for each transposition
const modeIIINeighbors = {
    1: {
        'series1': ['CIII-7', 'EIII7', 'CIIIø7', 'EIII-7', 'AbIII7', 'EIIIø7', 'AbIII-7', 'CIII7', 'AbIIIø7'],
        'series2': ['CIII-9', 'EIII7/Δ7', 'CIIIø7b13', 'EIII-9', 'AbIII7/Δ7', 'EIIIø7b13', 'AbIII-9', 'CIII7/Δ7', 'AbIIIø7b13'],
        'series3': ['CIII-9(#11)', 'EIII7/Δ7/#9', 'CIIIø7b13(♮3)', 'EIII-9(#11)', 'AbIII7/Δ7/#9', 'EIIIø7b13(♮3)', 'AbIII-9(#11)', 'CIII7/Δ7/#9', 'AbIIIø7b13(♮3)']
    },
    2: {
        'series1': ['DbIII-7', 'FIII7', 'DbIIIø7', 'FIII-7', 'AIII7', 'FIIIø7', 'AIII-7', 'DbIII7', 'AIIIø7'],
        'series2': ['DbIII-9', 'FIII7/Δ7', 'DbIIIø7b13', 'FIII-9', 'AIII7/Δ7', 'FIIIø7b13', 'AIII-9', 'DbIII7/Δ7', 'AIIIø7b13'],
        'series3': ['DbIII-9(#11)', 'FIII7/Δ7/#9', 'DbIIIø7b13(♮3)', 'FIII-9(#11)', 'AIII7/Δ7/#9', 'FIIIø7b13(♮3)', 'AIII-9(#11)', 'DbIII7/Δ7/#9', 'AIIIø7b13(♮3)']
    },
    3: {
        'series1': ['DIII-7', 'F#III7', 'DIIIø7', 'F#III-7', 'BbIII7', 'F#IIIø7', 'BbIII-7', 'DIII7', 'BbIIIø7'],
        'series2': ['DIII-9', 'F#III7/Δ7', 'DIIIø7b13', 'F#III-9', 'BbIII7/Δ7', 'F#IIIø7b13', 'BbIII-9', 'DIII7/Δ7', 'BbIIIø7b13'],
        'series3': ['DIII-9(#11)', 'F#III7/Δ7/#9', 'DIIIø7b13(♮3)', 'F#III-9(#11)', 'BbIII7/Δ7/#9', 'F#IIIø7b13(♮3)', 'BbIII-9(#11)', 'DIII7/Δ7/#9', 'BbIIIø7b13(♮3)']
    },
    4: {
        'series1': ['EbIII-7', 'GIII7', 'EbIIIø7', 'GIII-7', 'BIII7', 'GIIIø7', 'BIII-7', 'EbIII7', 'BIIIø7'],
        'series2': ['EbIII-9', 'GIII7/Δ7', 'EbIIIø7b13', 'GIII-9', 'BIII7/Δ7', 'GIIIø7b13', 'BIII-9', 'EbIII7/Δ7', 'BIIIø7b13'],
        'series3': ['EbIII-9(#11)', 'GIII7/Δ7/#9', 'EbIIIø7b13(♮3)', 'GIII-9(#11)', 'BIII7/Δ7/#9', 'GIIIø7b13(♮3)', 'BIII-9(#11)', 'EbIII7/Δ7/#9', 'BbIIIø7b13(♮3)']
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    preventZoomAndScaling();
});

// Comprehensive zoom and scaling prevention
function preventZoomAndScaling() {
    // Prevent pinch zoom on the entire document
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchmove', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    // Prevent zoom with keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '0')) {
            event.preventDefault();
        }
    });

    // Prevent context menu on long press
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
}

function initializeApp() {
    setupEventListeners();
    showScreen('welcome');
}

function setupEventListeners() {
    // Welcome screen
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('mode');
    });

    // Mode selection
    document.getElementById('mode-ii-btn').addEventListener('click', () => {
        appState.selectedMode = 'II';
        showChordCategoryScreen();
    });

    document.getElementById('mode-iii-btn').addEventListener('click', () => {
        appState.selectedMode = 'III';
        showChordCategoryScreen();
    });

    document.getElementById('mode-ad-btn').addEventListener('click', () => {
        appState.selectedMode = 'AD';
        showChordCategoryScreen();
    });

    // Return arrows
    document.getElementById('mode-return').addEventListener('click', () => {
        showScreen('welcome');
    });

    document.getElementById('chord-category-return').addEventListener('click', () => {
        showScreen('mode');
    });

    document.getElementById('chord-practice-return').addEventListener('click', () => {
        showScreen('chord-category');
    });

    // Chord practice controls
    document.getElementById('generate-chord-btn').addEventListener('click', generateChord);
    document.getElementById('neighbors-btn').addEventListener('click', toggleNeighbors);
}

function showChordCategoryScreen() {
    const chordCategoryGrid = document.getElementById('chord-category-grid');
    const title = document.getElementById('chord-category-title');
    
    // Clear previous content
    chordCategoryGrid.innerHTML = '';
    
    // Add random option
    const randomBtn = document.createElement('button');
    randomBtn.className = 'nav-btn';
    randomBtn.textContent = 'Random';
    randomBtn.onclick = () => selectChordCategory('random');
    chordCategoryGrid.appendChild(randomBtn);
    
    if (appState.selectedMode === 'II') {
        title.textContent = 'Choose Mode II Chord Type';
        
        const categories = ['II6', 'II#11', 'II13', 'II#9'];
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.textContent = category;
            btn.onclick = () => selectChordCategory(category);
            chordCategoryGrid.appendChild(btn);
        });
    } else if (appState.selectedMode === 'III') {
        title.textContent = 'Choose Mode III Chord Type';
        
        const categories = ['Minor', 'Dominant', 'Half-Diminished'];
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.textContent = category;
            btn.onclick = () => selectChordCategory(category);
            chordCategoryGrid.appendChild(btn);
        });
    } else if (appState.selectedMode === 'AD') {
        title.textContent = 'Choose Mode AD Chord Type';
        
        const categories = ['AD1', 'AD5'];
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.textContent = category;
            btn.onclick = () => selectChordCategory(category);
            chordCategoryGrid.appendChild(btn);
        });
    }
    
    showScreen('chord-category');
    
    // Automatically generate a chord with the selected mode and random category
    // This ensures there's always a chord ready to display
    appState.selectedChordCategory = 'random';
    generateChordSilently();
    
    // For AD mode, immediately disable neighbors button
    if (appState.selectedMode === 'AD') {
        const neighborsBtn = document.getElementById('neighbors-btn');
        if (neighborsBtn) {
            neighborsBtn.disabled = true;
        }
    }
}

function selectChordCategory(category) {
    appState.selectedChordCategory = category;
    showScreen('chord-practice');
    
    // Generate a chord with the selected category but don't display it yet
    generateChordSilently();
}

function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the requested screen
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        appState.currentScreen = screenName;
        
        // If showing chord practice screen, ensure it's completely clean
        if (screenName === 'chord-practice') {
            console.log('🎯 Showing chord practice screen - ensuring clean state');
            // Force clear any existing chord display
            const chordDisplay = document.getElementById('chord-display');
            const notation = document.getElementById('notation');
            if (chordDisplay) chordDisplay.textContent = 'Click "Generate Chord" to start';
            if (notation) notation.innerHTML = '';
        }
    }
}

function updateDisplay() {
    // Clear ALL displays and reset state
    document.getElementById('transposition-status-display').textContent = '-';
    document.getElementById('chord-display').textContent = 'Click "Generate Chord" to display the chord on staff';
    document.getElementById('notation').innerHTML = '';
    
    // Reset neighbors state
    appState.neighborsDisplayed = false;
    appState.currentChordWithNeighbors = null;
    appState.currentChord = null; // Clear current chord
    
    // Update neighbors button
    const neighborsBtn = document.getElementById('neighbors-btn');
    if (neighborsBtn) {
        neighborsBtn.textContent = 'Neighbors';
        neighborsBtn.classList.remove('active');
        // For AD mode, always disable neighbors button
        if (appState.selectedMode === 'AD') {
            neighborsBtn.disabled = true;
        } else {
            neighborsBtn.disabled = true; // Disable when no chord is displayed
        }
    }
    
    // Ensure no chord is displayed until Generate Chord is clicked
    console.log('🎯 Display cleared - waiting for Generate Chord button click');
} 

// Generate chord without displaying it (called when selecting chord category)
function generateChordSilently() {
    console.log('🎯 Generating chord silently (not displaying yet)');
    
    // Select a random valid key
    const preferredPitch = validKeys[Math.floor(Math.random() * validKeys.length)];
    
    let chords;
    if (appState.selectedMode === 'II') {
        // Filter chords based on selected category for Mode II
        switch (appState.selectedChordCategory) {
            case 'II6':
                chords = modeIIChords.filter(chord => chord.includes('II6'));
                break;
            case 'II#11':
                chords = modeIIChords.filter(chord => chord.includes('II#11'));
                break;
            case 'II13':
                chords = modeIIChords.filter(chord => chord.includes('II13'));
                break;
            case 'II#9':
                chords = modeIIChords.filter(chord => chord.includes('II#9'));
                break;
            case 'random':
            default:
                chords = modeIIChords;
                break;
        }
    } else if (appState.selectedMode === 'III') {
        // Filter chords based on selected category
        switch (appState.selectedChordCategory) {
            case 'Minor':
                chords = modeIIIChords.filter(chord => chord.includes('-7') || chord.includes('-9'));
                break;
            case 'Dominant':
                chords = modeIIIChords.filter(chord => chord.includes('7') && !chord.includes('ø7') && !chord.includes('-7') && !chord.includes('-9'));
                break;
            case 'Half-Diminished':
                chords = modeIIIChords.filter(chord => chord.includes('ø7'));
                break;
            case 'random':
            default:
                chords = modeIIIChords;
                break;
        }
    } else if (appState.selectedMode === 'AD') {
        // Filter chords based on selected category for AD mode
        switch (appState.selectedChordCategory) {
            case 'AD1':
                chords = modeADChords.filter(chord => chord.includes('AD1'));
                break;
            case 'AD5':
                chords = modeADChords.filter(chord => chord.includes('AD5'));
                break;
            case 'random':
            default:
                chords = modeADChords;
                break;
        }
    }
    
    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    
    // Detect chord type for special notation rules
    const isDiminished7 = randomChord.includes('ø7');
    const isMinorDominant = randomChord.includes('-7') || randomChord.includes('-9');
    const isMajorDominant = randomChord.includes('7') && !randomChord.includes('ø7') && !randomChord.includes('-7') && !randomChord.includes('-9');
    const is13Chord = randomChord.includes('13');
    const isADChord = randomChord.includes('AD');
    const isIISharp9 = randomChord.includes('II#9');
    
    let chordType = null;
    if (isDiminished7) {
        chordType = appState.selectedMode === 'III' ? 'diminished' : 'ø7';
    } else if (isMinorDominant) {
        chordType = 'minor-dominant';
    } else if (isMajorDominant) {
        chordType = 'major-dominant';
    } else if (is13Chord) {
        chordType = '13';
    } else if (isADChord) {
        chordType = 'AD';
    } else if (isIISharp9) {
        chordType = 'II#9';
    }
    
    // Get the pitch class for transposition
    const randomPitchIndex = pitchClasses[preferredPitch];
    
    // Replace 'C' with the preferred pitch representation
    let finalChord;
    if (appState.selectedMode === 'AD') {
        const chordTypeKey = randomChord.includes('AD1') ? 'AD1' : 'AD5';
        finalChord = `${preferredPitch}${chordTypeKey}`;
    } else {
        finalChord = randomChord.replace('C', preferredPitch);
    }
    
    // Store the generated chord as pending (not displayed yet)
    appState.pendingChord = finalChord;
    appState.chordGenerated = true;
    appState.chordDisplayed = false;
    
    // Update the chord display text to show the new chord
    document.getElementById('chord-display').textContent = finalChord;
    
    // Update the mode transposition display
    let transpositionInfo;
    if (appState.selectedMode === 'AD') {
        transpositionInfo = '-'; // AD mode always shows "-"
    } else {
        transpositionInfo = getModeTransposition(preferredPitch, appState.selectedMode);
    }
    document.getElementById('transposition-status-display').textContent = transpositionInfo;
    
    // Clear the staff (no notation displayed yet)
    document.getElementById('notation').innerHTML = '';
    
    // Reset neighbors state and button when generating new chord
    appState.neighborsDisplayed = false;
    appState.currentChordWithNeighbors = null;
    const neighborsBtn = document.getElementById('neighbors-btn');
    if (neighborsBtn) {
        neighborsBtn.textContent = 'Neighbors';
        neighborsBtn.classList.remove('active');
        // For AD mode, always disable neighbors button
        if (appState.selectedMode === 'AD') {
            neighborsBtn.disabled = true;
        } else {
            neighborsBtn.disabled = true; // Disable when chord not displayed
        }
    }
    
    console.log('🎯 Chord generated silently:', finalChord, '(text and transposition updated, staff NOT displayed yet)');
}

function generateChord() {
    console.log('🎯 Generate Chord button clicked');
    
    if (appState.chordGenerated && !appState.chordDisplayed) {
        // Show the pending chord
        console.log('🎯 Showing pending chord:', appState.pendingChord);
        displayChord(appState.pendingChord);
        appState.chordDisplayed = true;
        appState.currentChord = appState.pendingChord;
    } else {
        // Generate a new chord but don't display it
        console.log('🎯 Generating new chord (not displaying yet)');
        generateChordSilently();
        appState.chordDisplayed = false;
        
        // Disable neighbors button when chord is not displayed (except for AD mode which is always disabled)
        const neighborsBtn = document.getElementById('neighbors-btn');
        if (neighborsBtn) {
            if (appState.selectedMode === 'AD') {
                neighborsBtn.disabled = true; // AD mode always disabled
            } else {
                neighborsBtn.disabled = true; // Disable when chord not displayed
            }
        }
    }
}
    


function transposeNote(note, semitones, key, chordType = null, mode = null) {
    const pitch = note.slice(0, -1);
    const octave = parseInt(note.slice(-1));
    const pitchClass = pitchClasses[pitch];
    
    // Handle invalid notes
    if (pitchClass === undefined || isNaN(octave)) {
        console.error('Invalid note in transposeNote:', note);
        return note;
    }
    
    // Fix JavaScript modulo behavior for negative numbers - EXACT BPP logic
    const newPitch = ((pitchClass + semitones) % 12 + 12) % 12;
    const newOctave = octave + Math.floor((pitchClass + semitones) / 12);
    
    // Use BPP-style key-aware note representation
    const preferredNoteName = getNoteRepresentation(newPitch, key, chordType, mode);
    const pitchName = preferredNoteName;
    
    return `${pitchName}${newOctave}`;
}

function transposeChord(notes, semitones, key, chordType = null, mode = null) {
    return notes.map(note => transposeNote(note, semitones, key, chordType, mode));
}

function toggleNeighbors() {
    if (appState.selectedMode !== 'II' && appState.selectedMode !== 'III') {
        // AD mode - neighbors button should be completely disabled
        return;
    }
    
    if (!appState.neighborsDisplayed) {
        // Show neighbors
        if (!appState.currentChord) {
            alert('Please generate a chord first');
            return;
        }
        
        let neighbors;
        if (appState.selectedMode === 'II') {
            neighbors = findModeIINeighbors(appState.currentChord);
        } else if (appState.selectedMode === 'III') {
            neighbors = findModeIIINeighbors(appState.currentChord);
        }
        
        if (!neighbors) {
            alert('Could not find neighbors for this chord');
            return;
        }
        
        // Store current state
        appState.currentChordWithNeighbors = neighbors;
        appState.neighborsDisplayed = true;
        
        // Update display to show neighbors
        document.getElementById('chord-display').textContent = `${neighbors.left} | ${neighbors.current} | ${neighbors.right}`;
        
        // Generate voicings for all three chords
        const leftVoicing = generateChordVoicing(neighbors.left);
        const currentVoicing = generateChordVoicing(neighbors.current);
        const rightVoicing = generateChordVoicing(neighbors.right);
        
        console.log('=== ORIGINAL VOICINGS BEFORE SMOOTHING ===');
        console.log('Left chord:', neighbors.left, 'Voicing:', leftVoicing);
        console.log('Current chord:', neighbors.current, 'Voicing:', currentVoicing);
        console.log('Right chord:', neighbors.right, 'Voicing:', rightVoicing);
        
        // Apply voice leading improvement
        const improvedVoicings = improveNeighborVoiceLeading(leftVoicing, currentVoicing, rightVoicing);
        
        // Display all three voicings on the same staff
        drawStaffWithNeighbors(leftVoicing, currentVoicing, rightVoicing);
        
        // Update button text and styling
        const neighborsBtn = document.getElementById('neighbors-btn');
        if (neighborsBtn) {
            neighborsBtn.textContent = 'Hide Neighbors';
            neighborsBtn.classList.add('active');
            neighborsBtn.disabled = false; // Keep enabled when showing neighbors
        }
        
    } else {
        // Hide neighbors
        appState.neighborsDisplayed = false;
        
        // Restore original chord display
        if (appState.currentChordWithNeighbors) {
            document.getElementById('chord-display').textContent = appState.currentChordWithNeighbors.current;
            drawStaff(generateChordVoicing(appState.currentChordWithNeighbors.current));
            appState.currentChordWithNeighbors = null;
        }
        
        // Update button text and styling
        const neighborsBtn = document.getElementById('neighbors-btn');
        if (neighborsBtn) {
            neighborsBtn.textContent = 'Neighbors';
            neighborsBtn.classList.remove('active');
            neighborsBtn.disabled = false; // Keep enabled when chord is displayed
        }
    }
}

// Find neighbors for Mode II chords
function findModeIINeighbors(chordName) {
    if (appState.selectedMode !== 'II') return null;
    
    console.log('Finding neighbors for chord:', chordName);
    
    // Extract the key from the chord name (everything before "II")
    const keyMatch = chordName.match(/^([A-Z][#b]?)/);
    if (!keyMatch) {
        console.log('Could not extract key from chord name:', chordName);
        return null;
    }
    const key = keyMatch[1];
    console.log('Extracted key:', key);
    
    // Handle special case for F# (sharp keys)
    let actualKey = key;
    if (key === 'F' && chordName.startsWith('F#')) {
        actualKey = 'F#';
    } else if (key === 'C' && chordName.startsWith('C#')) {
        actualKey = 'C#';
    } else if (key === 'G' && chordName.startsWith('G#')) {
        actualKey = 'G#';
    } else if (key === 'D' && chordName.startsWith('D#')) {
        actualKey = 'D#';
    } else if (key === 'A' && chordName.startsWith('A#')) {
        actualKey = 'A#';
    } else if (key === 'E' && chordName.startsWith('E#')) {
        actualKey = 'E#';
    } else if (key === 'B' && chordName.startsWith('B#')) {
        actualKey = 'B#';
    }
    console.log('Actual key after sharp handling:', actualKey);
    
    // Determine which transposition this chord belongs to
    let transposition = null;
    if (['C', 'Eb', 'F#', 'A'].includes(actualKey)) {
        transposition = 1;
    } else if (['Db', 'E', 'G', 'Bb'].includes(actualKey)) {
        transposition = 2;
    } else if (['D', 'F', 'Ab', 'B'].includes(actualKey)) {
        transposition = 3;
    }
    
    console.log('Determined transposition:', transposition);
    if (!transposition) return null;
    
    // Determine which series this chord belongs to
    let series = null;
    if (chordName.includes('#11') || chordName.includes('13')) {
        series = '#11';
    } else if (chordName.includes('6') || chordName.includes('#9')) {
        series = '6';
    }
    
    console.log('Determined series:', series);
    if (!series) return null;
    
    // Find the chord in the array
    const chordArray = modeIINeighbors[transposition][series];
    console.log('Chord array:', chordArray);
    console.log('Looking for chord:', chordName);
    console.log('Available chords in array:', chordArray);
    const chordIndex = chordArray.indexOf(chordName);
    console.log('Chord index:', chordIndex);
    
    if (chordIndex === -1) return null;
    
    // Get left and right neighbors (with wraparound)
    const leftIndex = (chordIndex - 1 + chordArray.length) % chordArray.length;
    const rightIndex = (chordIndex + 1) % chordArray.length;
    
    console.log(`Chord ${chordName} at index ${chordIndex}`);
    console.log(`Left neighbor: ${chordArray[leftIndex]} (index ${leftIndex})`);
    console.log(`Right neighbor: ${chordArray[rightIndex]} (index ${rightIndex})`);
    
    const result = {
        left: chordArray[leftIndex],
        current: chordName,
        right: chordArray[rightIndex],
        transposition: transposition,
        series: series
    };
    
    console.log('Found neighbors:', result);
    return result;
}

// Find neighbors for Mode III chords
function findModeIIINeighbors(chordName) {
    if (appState.selectedMode !== 'III') return null;
    
    console.log('Finding Mode III neighbors for chord:', chordName);
    
    // Extract the key from the chord name (everything before "III")
    const keyMatch = chordName.match(/^([A-Z][#b]?)/);
    if (!keyMatch) {
        console.log('Could not extract key from chord name:', chordName);
        return null;
    }
    const key = keyMatch[1];
    console.log('Extracted key:', key);
    
    // Handle special case for sharp keys
    let actualKey = key;
    if (key === 'F' && chordName.startsWith('F#')) {
        actualKey = 'F#';
    } else if (key === 'C' && chordName.startsWith('C#')) {
        actualKey = 'C#';
    } else if (key === 'G' && chordName.startsWith('G#')) {
        actualKey = 'G#';
    } else if (key === 'D' && chordName.startsWith('D#')) {
        actualKey = 'D#';
    } else if (key === 'A' && chordName.startsWith('A#')) {
        actualKey = 'A#';
    } else if (key === 'E' && chordName.startsWith('E#')) {
        actualKey = 'E#';
    } else if (key === 'B' && chordName.startsWith('B#')) {
        actualKey = 'B#';
    }
    console.log('Actual key after sharp handling:', actualKey);
    
    // Determine which transposition this chord belongs to
    let transposition = null;
    if (['C', 'E', 'Ab'].includes(actualKey)) {
        transposition = 1;
    } else if (['Db', 'F', 'A'].includes(actualKey)) {
        transposition = 2;
    } else if (['D', 'F#', 'Bb'].includes(actualKey)) {
        transposition = 3;
    } else if (['Eb', 'G', 'B'].includes(actualKey)) {
        transposition = 4;
    }
    
    console.log('Determined transposition:', transposition);
    if (!transposition) return null;
    
    // Determine which series this chord belongs to
    // For Mode III, we need to check all three series to find which one contains this chord
    let series = null;
    for (let s = 1; s <= 3; s++) {
        const seriesKey = `series${s}`;
        if (modeIIINeighbors[transposition][seriesKey].includes(chordName)) {
            series = seriesKey;
            break;
        }
    }
    
    console.log('Determined series:', series);
    if (!series) return null;
    
    // Find the chord in the array
    const chordArray = modeIIINeighbors[transposition][series];
    console.log('Chord array:', chordArray);
    console.log('Looking for chord:', chordName);
    console.log('Available chords in array:', chordArray);
    const chordIndex = chordArray.indexOf(chordName);
    console.log('Chord index:', chordIndex);
    
    if (chordIndex === -1) return null;
    
    // Get left and right neighbors (with wraparound)
    const leftIndex = (chordIndex - 1 + chordArray.length) % chordArray.length;
    const rightIndex = (chordIndex + 1) % chordArray.length;
    
    console.log(`Chord ${chordName} at index ${chordIndex}`);
    console.log(`Left neighbor: ${chordArray[leftIndex]} (index ${leftIndex})`);
    console.log(`Right neighbor: ${chordArray[rightIndex]} (index ${rightIndex})`);
    
    const result = {
        left: chordArray[leftIndex],
        current: chordName,
        right: chordArray[rightIndex],
        transposition: transposition,
        series: series
    };
    
    console.log('Found neighbors:', result);
    return result;
}

// Generate chord voicing for a given chord name
function generateChordVoicing(chordName) {
    console.log('Generating voicing for chord:', chordName);
    
    // Extract the key from the chord name (everything before "II" or "III")
    const keyMatch = chordName.match(/^([A-Z][#b]?)/);
    if (!keyMatch) {
        console.log('Could not extract key from chord name:', chordName);
        return [];
    }
    const key = keyMatch[1];
    
    // Handle special case for sharp keys
    let actualKey = key;
    if (key === 'F' && chordName.startsWith('F#')) {
        actualKey = 'F#';
    } else if (key === 'C' && chordName.startsWith('C#')) {
        actualKey = 'C#';
    } else if (key === 'G' && chordName.startsWith('G#')) {
        actualKey = 'G#';
    } else if (key === 'D' && chordName.startsWith('D#')) {
        actualKey = 'D#';
    } else if (key === 'A' && chordName.startsWith('A#')) {
        actualKey = 'A#';
    } else if (key === 'E' && chordName.startsWith('E#')) {
        actualKey = 'E#';
    } else if (key === 'B' && chordName.startsWith('B#')) {
        actualKey = 'B#';
    }
    
    console.log('Extracted key for voicing:', actualKey);
    
    // Determine if this is Mode II or Mode III
    const isModeIII = chordName.includes('III');
    const mode = isModeIII ? 'III' : 'II';
    
    // Get the original voicing in C
    let originalVoicing;
    if (isModeIII) {
        // Mode III voicings - need to check in order of specificity
        if (chordName.includes('ø7b13(♮3)')) {
            originalVoicing = chordVoicings['III']['CIIIø7b13(♮3)'];
        } else if (chordName.includes('ø7b13')) {
            originalVoicing = chordVoicings['III']['CIIIø7b13'];
        } else if (chordName.includes('ø7')) {
            originalVoicing = chordVoicings['III']['CIIIø7'];
        } else if (chordName.includes('-9(#11)')) {
            originalVoicing = chordVoicings['III']['CIII-9(#11)'];
        } else if (chordName.includes('-9')) {
            originalVoicing = chordVoicings['III']['CIII-9'];
        } else if (chordName.includes('-7')) {
            originalVoicing = chordVoicings['III']['CIII-7'];
        } else if (chordName.includes('7/Δ7/#9')) {
            originalVoicing = chordVoicings['III']['CIII7/Δ7/#9'];
        } else if (chordName.includes('7/Δ7')) {
            originalVoicing = chordVoicings['III']['CIII7/Δ7'];
        } else if (chordName.includes('7') && !chordName.includes('ø7')) {
            originalVoicing = chordVoicings['III']['CIII7'];
        }
    } else {
        // Mode II voicings
        if (chordName.includes('6')) {
            originalVoicing = chordVoicings['II']['CII6'];
        } else if (chordName.includes('#11')) {
            originalVoicing = chordVoicings['II']['CII#11'];
        } else if (chordName.includes('13')) {
            originalVoicing = chordVoicings['II']['CII13'];
        } else if (chordName.includes('#9')) {
            originalVoicing = chordVoicings['II']['CII#9'];
        }
    }
    
    console.log('Original C voicing for', chordName, ':', originalVoicing);
    
    if (!originalVoicing) {
        console.log('No original voicing found for chord type');
        return [];
    }
    
    // Calculate transposition semitones
    const transpositionSemitones = pitchClasses[actualKey];
    console.log('Transposition semitones:', transpositionSemitones);
    
    if (transpositionSemitones === undefined) {
        console.log('Invalid key for transposition:', actualKey);
        return [];
    }
    
    // Determine chord type for proper note representation
    let chordTypeForRep = null;
    if (isModeIII) {
        if (chordName.includes('-7') || chordName.includes('-9') || chordName.includes('-9(#11)')) {
            chordTypeForRep = 'minor-dominant';
        } else if (chordName.includes('7') && !chordName.includes('ø7')) {
            chordTypeForRep = 'major-dominant';
        } else if (chordName.includes('ø7')) {
            chordTypeForRep = 'diminished';
        }
    } else {
        if (chordName.includes('13')) {
            chordTypeForRep = '13';
        } else if (chordName.includes('#11')) {
            chordTypeForRep = '#11';
        } else if (chordName.includes('#9')) {
            chordTypeForRep = '#9';
        } else if (chordName.includes('6')) {
            chordTypeForRep = '6';
        }
    }
    
    // Transpose the voicing
    console.log('=== TRANSPOSITION DEBUG ===');
    console.log('Original voicing:', originalVoicing);
    console.log('Transposition semitones:', transpositionSemitones);
    console.log('Target key:', actualKey);
    console.log('Chord type:', chordTypeForRep);
    console.log('Mode:', mode);
    
    const transposedVoicing = transposeChord(originalVoicing, transpositionSemitones, actualKey, chordTypeForRep, mode);
    console.log('Transposed voicing:', transposedVoicing);
    
    // Apply octave adjustment and enharmonic fixes
    console.log('=== OCTAVE ADJUSTMENT DEBUG ===');
    console.log('Before octave adjustment:', transposedVoicing);
    
    const octaveAdjustedVoicing = adjustChordOctave(transposedVoicing, actualKey, chordTypeForRep, mode);
    console.log('After octave adjustment:', octaveAdjustedVoicing);
    
    const enharmonicFixedVoicing = fixEnharmonicConflictsEnhanced(octaveAdjustedVoicing, actualKey, chordTypeForRep, mode);
    console.log('After enharmonic fixes:', enharmonicFixedVoicing);
    
    console.log('Final voicing for', chordName, ':', enharmonicFixedVoicing);
    return enharmonicFixedVoicing;
}

// Improve voice leading for neighbor chords by adjusting octaves
function improveNeighborVoiceLeading(leftVoicing, currentVoicing, rightVoicing) {
    console.log('Improving voice leading for neighbor chords');
    console.log('Original voicings:');
    console.log('Left:', leftVoicing);
    console.log('Current:', currentVoicing);
    console.log('Right:', rightVoicing);
    
    // Get the average pitch of each voicing
    const getAveragePitch = (voicing) => {
        let totalPitch = 0;
        let count = 0;
        
        for (const note of voicing) {
            const [pitchClass, octave] = noteToPitch(note);
            if (pitchClass !== undefined && octave !== undefined) {
                const absolutePitch = pitchClass + (octave * 12);
                totalPitch += absolutePitch;
                count++;
            }
        }
        
        return count > 0 ? totalPitch / count : 0;
    };
    
    const leftAvgPitch = getAveragePitch(leftVoicing);
    const currentAvgPitch = getAveragePitch(currentVoicing);
    const rightAvgPitch = getAveragePitch(rightVoicing);
    
    console.log('Average pitches:', leftAvgPitch, currentAvgPitch, rightAvgPitch);
    
    // Calculate target average pitch (use current as reference)
    const targetAvgPitch = currentAvgPitch;
    const tolerance = 6; // Allow some variation
    
    let adjustedLeftVoicing = [...leftVoicing];
    let adjustedRightVoicing = [...rightVoicing];
    
    // Adjust left voicing if it's too far from current
    if (Math.abs(leftAvgPitch - targetAvgPitch) > tolerance) {
        const leftShift = Math.round((targetAvgPitch - leftAvgPitch) / 12) * 12;
        if (Math.abs(leftShift) >= 12) {
            console.log('Adjusting left voicing by', leftShift / 12, 'octave(s)');
            adjustedLeftVoicing = leftVoicing.map(note => {
                const [pitchClass, octave] = noteToPitch(note);
                if (pitchClass === undefined || octave === undefined) return note;
                
                const newOctave = octave + (leftShift / 12);
                const pitchName = note.slice(0, -1);
                return `${pitchName}${newOctave}`;
            });
        }
    }
    
    // Adjust right voicing if it's too far from current
    if (Math.abs(rightAvgPitch - targetAvgPitch) > tolerance) {
        const rightShift = Math.round((targetAvgPitch - rightAvgPitch) / 12) * 12;
        if (Math.abs(rightShift) >= 12) {
            console.log('Adjusting right voicing by', rightShift / 12, 'octave(s)');
            adjustedRightVoicing = rightVoicing.map(note => {
                const [pitchClass, octave] = noteToPitch(note);
                if (pitchClass === undefined || octave === undefined) return note;
                
                const newOctave = octave + (rightShift / 12);
                const pitchName = note.slice(0, -1);
                return `${pitchName}${newOctave}`;
            });
        }
    }
    
    console.log('Adjusted voicings:');
    console.log('Left:', adjustedLeftVoicing);
    console.log('Current:', currentVoicing);
    console.log('Right:', adjustedRightVoicing);
    
    return {
        left: adjustedLeftVoicing,
        current: currentVoicing,
        right: adjustedRightVoicing
    };
}

// Draw staff with three chords side by side
function drawStaffWithNeighbors(leftVoicing, currentVoicing, rightVoicing) {
    const notationDiv = document.getElementById('notation');
    notationDiv.innerHTML = '';
    
    // Apply voice leading improvement
    const improvedVoicings = improveNeighborVoiceLeading(leftVoicing, currentVoicing, rightVoicing);
    
    // Check if this is a Mode III chord with hand separation
    const hasHandSeparation = currentVoicing.includes('|');
    
    if (hasHandSeparation && appState.selectedMode === 'III') {
        // Mode III: Use two staves (bass and treble) for each chord
        console.log('🎼 Mode III neighbors with hand separation detected');
        
        // Split each voicing into left and right hand
        const leftLeftHand = improvedVoicings.left.slice(0, improvedVoicings.left.indexOf('|'));
        const leftRightHand = improvedVoicings.left.slice(improvedVoicings.left.indexOf('|') + 1);
        const currentLeftHand = improvedVoicings.current.slice(0, improvedVoicings.current.indexOf('|'));
        const currentRightHand = improvedVoicings.current.slice(improvedVoicings.current.indexOf('|') + 1);
        const rightLeftHand = improvedVoicings.right.slice(0, improvedVoicings.right.indexOf('|'));
        const rightRightHand = improvedVoicings.right.slice(improvedVoicings.right.indexOf('|') + 1);
        
        // Convert to ABC format
        const leftLeftABC = convertToABCWithAccidentals(leftLeftHand);
        const leftRightABC = convertToABCWithAccidentals(leftRightHand);
        const currentLeftABC = convertToABCWithAccidentals(currentLeftHand);
        const currentRightABC = convertToABCWithAccidentals(currentRightHand);
        const rightLeftABC = convertToABCWithAccidentals(rightLeftHand);
        const rightRightABC = convertToABCWithAccidentals(rightRightHand);
        
        // Create ABC notation with two staves for three chords side by side
        const abcNotation = `X:1
L:1/4
K:C
V:1 clef=treble
[${leftRightABC.join('')}]4 [${currentRightABC.join('')}]4 [${rightRightABC.join('')}]4
V:2 clef=bass
[${leftLeftABC.join('')}]4 [${currentLeftABC.join('')}]4 [${rightLeftABC.join('')}]4`;
        
        console.log(`🎼 ABC notation for Mode III neighbors:`, abcNotation);
        
        // Render with ABC.js using two staves
        try {
            ABCJS.renderAbc(notationDiv, abcNotation, {
                responsive: "resize",
                scale: 1.0,
                staffwidth: 450,
                paddingleft: 15,
                paddingright: 15,
                paddingtop: 15,
                paddingbottom: 15,
                viewportHorizontal: true,
                viewportVertical: true,
                add_classes: true,
                format: {
                    titlefont: "serif 14",
                    gchordfont: "serif 10",
                    vocalfont: "serif 11",
                    annotationfont: "serif 10",
                    historyfont: "serif 14",
                    infofont: "serif 10",
                    measurefont: "serif 10",
                    partsfont: "serif 10",
                    repeatfont: "serif 10",
                    textfont: "serif 10",
                    voicefont: "serif 10",
                    wordsfont: "serif 10"
                },
                wrap: {
                    minSpacing: 1.6,
                    maxSpacing: 2.4,
                    preferredMeasuresPerLine: 16
                }
            });

            // Apply immediate styling to make the staff larger - THIS IS THE KEY!
            setTimeout(() => {
                const svg = notationDiv.querySelector('svg');
                if (svg) {
                    
                    console.log("🎯 Post-render styling applied for Mode II neighbors!");
                    
                    // Force the SVG to be much larger
                    
                    // Apply the white filter
                    svg.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))';
                    
                    console.log('🎯 Post-render styling applied!');
                }
            }, 100);
            
            console.log(`✅ ABC.js rendered successfully with Mode III neighbors on two staves`);
            console.log(`Staff drawn successfully with notes:`, currentVoicing);
        } catch (error) {
            console.error(`❌ Error rendering ABC:`, error);
            notationDiv.innerHTML = `<p style="color: red;">Error rendering staff: ${error.message}</p>`;
        }
        
    } else {
        // Mode II or other modes: Use single staff
        console.log('🎼 Mode II or other mode neighbors - using single staff');
        
        // Convert all voicings to ABC format
        const leftABC = convertToABCWithAccidentals(improvedVoicings.left);
        const currentABC = convertToABCWithAccidentals(improvedVoicings.current);
        const rightABC = convertToABCWithAccidentals(improvedVoicings.right);
        
        // Create ABC notation with three chords side by side
        const abcNotation = `X:1
L:1/4
K:C
[${leftABC.join('')}]4 [${currentABC.join('')}]4 [${rightABC.join('')}]4`;
        
        console.log(`🎼 ABC notation for neighbors:`, abcNotation);
        
        // Render with ABC.js
        try {
            // Use original working parameters with device detection (from BPP web version)
            let staffwidth, scale, padding;
            const isPC = typeof window.orientation === 'undefined';
            const isLandscape = window.orientation === 90 || window.orientation === -90;
            
            if (isPC) {
                // PC: Use original working parameters
                staffwidth = 450;
                scale = 1.0;
                padding = 40;
            } else if (isLandscape) {
                // Mobile landscape: Use original working parameters
                staffwidth = 450;
                scale = 1.0;
                padding = 20;
            } else {
                // Mobile portrait: Use original working parameters
                staffwidth = 400;
                scale = 1.0;
                padding = 15;
            }
            
            // Use fixed measures per line like the original version
            const measuresPerLine = 16;
            
            ABCJS.renderAbc(notationDiv, abcNotation, {
                responsive: "resize",
                scale: 1.0,
                staffwidth: 450,
                paddingleft: 15,
                paddingright: 15,
                paddingtop: 15,
                paddingbottom: 15,
                viewportHorizontal: true,
                viewportVertical: true,
                add_classes: true,
                format: {
                    titlefont: "serif 14",
                    gchordfont: "serif 10",
                    vocalfont: "serif 11",
                    annotationfont: "serif 10",
                    historyfont: "serif 14",
                    infofont: "serif 10",
                    measurefont: "serif 10",
                    partsfont: "serif 10",
                    repeatfont: "serif 10",
                    textfont: "serif 10",
                    voicefont: "serif 10",
                    wordsfont: "serif 10"
                },
                wrap: {
                    minSpacing: 1.6,
                    maxSpacing: 2.4,
                    preferredMeasuresPerLine: measuresPerLine
                }
            });

            // Apply immediate styling to make the staff larger - THIS IS THE KEY!
            setTimeout(() => {
                const svg = notationDiv.querySelector('svg');
                if (svg) {
                    
                    console.log("🎯 Post-render styling applied for Mode II neighbors!");
                    
                    // Force the SVG to be much larger
                    
                    // Apply the white filter
                    svg.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))';
                    
                    console.log('🎯 Post-render styling applied!');
                }
            }, 100);
            
            console.log(`✅ ABC.js rendered successfully with three chords`);
            console.log(`Staff drawn successfully with notes:`, currentVoicing);
        } catch (error) {
            console.error(`❌ Error rendering ABC:`, error);
            notationDiv.innerHTML = `<p style="color: red;">Error rendering staff: ${error.message}</p>`;
        }
    }
}

// Note to pitch conversion (from BPP web version)
function noteToPitch(note) {
    const pitchClasses = {
        "C": 0, "Db": 1, "C#": 1, "D": 2, "Eb": 3, "D#": 3, "E": 4,
        "F": 5, "Gb": 6, "F#": 6, "G": 7, "Ab": 8, "G#": 8, "A": 9,
        "Bb": 10, "A#": 10, "B": 11
    };
    
    // Validate the note input
    if (!note || typeof note !== 'string') {
        console.error('Invalid note input:', note);
        return [undefined, undefined];
    }
    
    const name = note.slice(0, -1);
    const octaveStr = note.slice(-1);
    const octave = parseInt(octaveStr);
    
    // Validate the note name and octave
    if (!(name in pitchClasses)) {
        console.error('Invalid note name:', name, 'in note:', note);
        return [undefined, undefined];
    }
    
    if (isNaN(octave)) {
        console.error('Invalid octave:', octaveStr, 'in note:', note);
        return [undefined, undefined];
    }
    
    return [pitchClasses[name], octave];
}

// Octave limit constants (B1 to C5 range)
const D2_PITCH = 11 + (1 * 12); // B1 = 23
const C5_PITCH = 0 + (5 * 12); // C5 = 60

// Left hand (bass clef) range constraints (B1 to G#3)
const LEFT_HAND_LOW = 11 + (1 * 12); // B1 = 23
const LEFT_HAND_HIGH = 8 + (3 * 12); // G#3 = 44

// Mode II specific pitch range constraints (B2 to B4) - HIGHEST PRIORITY
const MODE_II_LOW = 11 + (2 * 12); // B2 = 35
const MODE_II_HIGH = 11 + (4 * 12); // B4 = 59

// Check if left hand (bass clef) part is within required range (B1 to G#3)
function isLeftHandInRange(chord) {
    // Find the separator to identify left hand notes
    const separatorIndex = chord.indexOf('|');
    if (separatorIndex === -1) {
        // No separator means this is not a Mode III or AD chord, so no left hand constraint
        return true;
    }
    
    // Get left hand notes (before the separator)
    const leftHandNotes = chord.slice(0, separatorIndex);
    
    for (const note of leftHandNotes) {
        const [pitchClass, octave] = noteToPitch(note);
        if (pitchClass === undefined || octave === undefined) continue;
        
        const absolutePitch = pitchClass + (octave * 12);
        if (absolutePitch < LEFT_HAND_LOW || absolutePitch > LEFT_HAND_HIGH) {
            return false;
        }
    }
    
    return true;
}

// Check if chord is within comfortable reading range (B1 to C5)
function isChordInRange(chord) {
    for (const note of chord) {
        const [pitchClass, octave] = noteToPitch(note);
        if (pitchClass === undefined || octave === undefined) {
            continue;
        }
        const absolutePitch = pitchClass + (octave * 12);
        
        if (absolutePitch < D2_PITCH || absolutePitch > C5_PITCH) {
            return false;
        }
    }
    return true;
}

// Check if Mode II chord is within required range (B2 to B4) - HIGHEST PRIORITY
function isModeIIInRange(chord) {
    if (appState.selectedMode !== 'II') {
        return true;
    }
    
    for (const note of chord) {
        const [pitchClass, octave] = noteToPitch(note);
        if (pitchClass === undefined || octave === undefined) continue;
        
        const absolutePitch = pitchClass + (octave * 12);
        
        if (absolutePitch < MODE_II_LOW || absolutePitch > MODE_II_HIGH) {
            return false;
        }
    }
    return true;
}

// Determine which transposition of the mode a chord belongs to
function getModeTransposition(rootNote, mode) {
    if (mode === 'II') {
        const transposition1 = new Set(["C", "Eb", "F#", "A"]);
        const transposition2 = new Set(["Db", "E", "G", "Bb"]);
        const transposition3 = new Set(["D", "F", "Ab", "B"]);
        
        if (transposition1.has(rootNote)) {
            return "Mode II, 1";
        } else if (transposition2.has(rootNote)) {
            return "Mode II, 2";
        } else if (transposition3.has(rootNote)) {
            return "Mode II, 3";
        }
    } else if (mode === 'III') {
        const transposition1 = new Set(["C", "E", "Ab"]);
        const transposition2 = new Set(["Db", "F", "A"]);
        const transposition3 = new Set(["D", "F#", "Bb"]);
        const transposition4 = new Set(["Eb", "G", "B"]);
        
        if (transposition1.has(rootNote)) {
            return "Mode III, 1";
        } else if (transposition2.has(rootNote)) {
            return "Mode III, 2";
        } else if (transposition3.has(rootNote)) {
            return "Mode III, 3";
        } else if (transposition4.has(rootNote)) {
            return "Mode III, 4";
        }
    } else if (mode === 'AD') {
        const transposition1 = new Set(["C", "F", "Bb"]);
        const transposition2 = new Set(["Db", "F#", "B"]);
        const transposition3 = new Set(["D", "G", "C"]);
        const transposition4 = new Set(["Eb", "Ab", "Db"]);
        const transposition5 = new Set(["E", "A", "D"]);
        
        if (transposition1.has(rootNote)) {
            return "Mode AD, 1";
        } else if (transposition2.has(rootNote)) {
            return "Mode AD, 2";
        } else if (transposition3.has(rootNote)) {
            return "Mode AD, 3";
        } else if (transposition4.has(rootNote)) {
            return "Mode AD, 4";
        } else if (transposition5.has(rootNote)) {
            return "Mode AD, 5";
        }
    }
    
    return "Unknown transposition";
}

// BPP-style key-based note representation system
const PITCH_CLASSES_SHARP = {0: "C", 1: "C#", 2: "D", 3: "D#", 4: "E", 5: "F",
                             6: "F#", 7: "G", 8: "G#", 9: "A", 10: "A#", 11: "B"};
const PITCH_CLASSES_FLAT = {0: "C", 1: "Db", 2: "D", 3: "Eb", 4: "E", 5: "F",
                            6: "Gb", 7: "G", 8: "Ab", 9: "A", 10: "Bb", 11: "B"};
const FLAT_KEYS = new Set(["Db", "Ab", "Eb", "Bb", "F"]);
const SHARP_KEYS = new Set(["F#", "B", "E", "A", "D", "G", "C"]);

// Get the appropriate note representation based on key and mode
function getNoteRepresentation(pitchClass, key, chordType = null, mode = null) {
    console.log(`🔍 getNoteRepresentation called with: pitchClass=${pitchClass}, key=${key}, chordType=${chordType}, mode=${mode}`);
    
    // ===== MODE III CHORD LOGIC =====
    
    // 1. MODE III MINOR CHORDS (-7, -9, -9(#11)) - Secondary Root Logic
    if (mode === 'III' && (chordType === 'minor-dominant' || chordType === 'minor-9' || chordType === 'minor-9-sharp11')) {
        console.log(`🎯 Special Mode III minor rule triggered for key ${key}`);
        
        // Special case: Ab is treated as a sharp key for Mode III minor chords
        if (key === 'Ab') {
            // For Ab minor chords, use sharps for left hand notes
            if (pitchClass === 7 || pitchClass === 0 || pitchClass === 2 || pitchClass === 10) {
                // Right hand notes: apply secondary root rule
                const secondaryRoot = 'G'; // Ab -> G
                const flatKeysForSecondaryRoot = new Set(["Eb", "Bb", "F", "C", "G"]);
                const sharpKeysForSecondaryRoot = new Set(["G#", "C#", "F#", "B", "E", "A", "D"]);
                
                if (flatKeysForSecondaryRoot.has(secondaryRoot)) {
                    console.log(`🎯 ${key} key right hand note: secondary root ${secondaryRoot} is flat key, using flats for pitch class ${pitchClass}`);
                    return PITCH_CLASSES_FLAT[pitchClass];
                } else if (sharpKeysForSecondaryRoot.has(secondaryRoot)) {
                    console.log(`🎯 ${key} key right hand note: secondary root ${secondaryRoot} is sharp key, using sharps for pitch class ${pitchClass}`);
                    return PITCH_CLASSES_SHARP[pitchClass];
                }
            } else {
                // Left hand notes: use sharps for Ab minor chords
                console.log(`🎯 ${key} key left hand note: using sharps for pitch class ${pitchClass}`);
                return PITCH_CLASSES_SHARP[pitchClass];
            }
        }
        
        // Define flat and sharp keys for secondary root classification
        const flatKeysForSecondaryRoot = new Set(["Eb", "Bb", "F", "C", "G"]);
        const sharpKeysForSecondaryRoot = new Set(["G#", "C#", "F#", "B", "E", "A", "D"]);
        
        // Determine the secondary root based on the main chord root
        let secondaryRoot = null;
        if (key === 'C') secondaryRoot = 'B';      // CIII-7 right hand: B5
        else if (key === 'Db') secondaryRoot = 'C'; // DbIII-7 right hand: C4
        else if (key === 'D') secondaryRoot = 'C#'; // DIII-7 right hand: C#3
        else if (key === 'Eb') secondaryRoot = 'D'; // EbIII-7 right hand: D3
        else if (key === 'E') secondaryRoot = 'D#'; // EIII-7 right hand: D#3
        else if (key === 'F') secondaryRoot = 'E';  // FIII-7 right hand: E3
        else if (key === 'F#') secondaryRoot = 'F'; // F#III-7 right hand: F3
        else if (key === 'G') secondaryRoot = 'F#'; // GIII-7 right hand: F#3
        else if (key === 'Ab') secondaryRoot = 'G'; // AbIII-7 right hand: G3
        else if (key === 'A') secondaryRoot = 'G#'; // AIII-7 right hand: G#3
        else if (key === 'Bb') secondaryRoot = 'A'; // BbIII-7 right hand: A3
        else if (key === 'B') secondaryRoot = 'Bb'; // BIII-7 right hand: Bb3
        
        console.log(`🎯 Secondary root for ${key}III: ${secondaryRoot}`);
        
        // Check if this is a right hand note by looking at the pitch classes that appear in right hand
        let isRightHandNote = false;
        
        // For each key, identify which pitch classes are right hand notes (MINOR CHORDS ONLY)
        if (key === 'C' && (pitchClass === 11 || pitchClass === 2 || pitchClass === 6)) isRightHandNote = true;           // B5, D6, F#6
        else if (key === 'Db' && (pitchClass === 0 || pitchClass === 2 || pitchClass === 3 || pitchClass === 7)) isRightHandNote = true;  // C4, D#4, Eb4, G#6
        else if (key === 'D' && (pitchClass === 1 || pitchClass === 4 || pitchClass === 8)) isRightHandNote = true;       // C#3, E6, G#6
        else if (key === 'Eb' && (pitchClass === 2 || pitchClass === 5 || pitchClass === 9)) isRightHandNote = true;      // D3, F6, A6
        else if (key === 'E' && (pitchClass === 3 || pitchClass === 6 || pitchClass === 10)) isRightHandNote = true;       // D#3, F#6, B6
        else if (key === 'F' && (pitchClass === 4 || pitchClass === 7 || pitchClass === 11)) isRightHandNote = true;       // E3, G6, B6
        else if (key === 'F#' && (pitchClass === 5 || pitchClass === 8 || pitchClass === 0)) isRightHandNote = true;      // F3, G#3/Ab3, C7
        else if (key === 'G' && (pitchClass === 6 || pitchClass === 11 || pitchClass === 9 || pitchClass === 1)) isRightHandNote = true;  // F#3, B3, A6, C#7
        else if (key === 'Ab' && (pitchClass === 7 || pitchClass === 0 || pitchClass === 2 || pitchClass === 10)) isRightHandNote = true;      // G3, C7, D7, Bb3
        else if (key === 'A' && (pitchClass === 8 || pitchClass === 1 || pitchClass === 3)) isRightHandNote = true;       // G#3, C#7, D#7
        else if (key === 'Bb' && (pitchClass === 9 || pitchClass === 2 || pitchClass === 4)) isRightHandNote = true;      // A3, D7, E7
        else if (key === 'B' && (pitchClass === 10 || pitchClass === 1 || pitchClass === 3 || pitchClass === 5)) isRightHandNote = true;  // Bb3, C#/Db4, D#7, F7
        
        if (isRightHandNote) {
            // Right hand notes: apply secondary root rule
            if (flatKeysForSecondaryRoot.has(secondaryRoot)) {
                console.log(`🎯 ${key} key right hand note: secondary root ${secondaryRoot} is flat key, using flats for pitch class ${pitchClass}`);
                return PITCH_CLASSES_FLAT[pitchClass];
            } else if (sharpKeysForSecondaryRoot.has(secondaryRoot)) {
                console.log(`🎯 ${key} key right hand note: secondary root ${secondaryRoot} is sharp key, using sharps for pitch class ${pitchClass}`);
                return PITCH_CLASSES_SHARP[pitchClass];
            }
        } else {
            // Left hand notes: use existing logic for G, A, B keys
            if (key === 'G') {
                console.log(`🎯 G key left hand note: using flats for pitch class ${pitchClass}`);
                return PITCH_CLASSES_FLAT[pitchClass];
            } else if (key === 'A') {
                console.log(`🎯 A key left hand note: using flats for pitch class ${pitchClass}`);
                return PITCH_CLASSES_FLAT[pitchClass];
            } else if (key === 'B') {
                console.log(`🎯 B key left hand note: using sharps for pitch class ${pitchClass}`);
                return PITCH_CLASSES_SHARP[pitchClass];
            }
        }
    }
    
    // 2. MODE III DOMINANT CHORDS (7, 7/Δ7, 7/Δ7/#9) - Custom Enharmonic Mapping
    if (mode === 'III' && chordType === 'major-dominant') {
        console.log(`🎯 Special Mode III dominant rule triggered for key ${key}`);
        
        // Custom enharmonic mapping for Mode III 7/Δ7/#9 chords based on desired output
        const modeIII7EnharmonicMap = {
            'C': { 8: 'G#', 11: 'B', 3: 'D#' },           // G#3, B3, D#4
            'Db': { 9: 'A', 0: 'C', 4: 'E' },            // A3, C4, E4
            'D': { 10: 'Bb', 1: 'Db', 5: 'F' },          // Bb3, Db4, F4
            'Eb': { 11: 'B', 2: 'D', 6: 'F#' },           // B3, D4, F#4
            'E': { 0: 'C', 3: 'Eb', 7: 'G' },            // C4, Eb4, G4
            'F': { 1: 'C#', 4: 'E', 8: 'G#' },            // C#3, E3, G#3
            'F#': { 2: 'D', 5: 'F', 9: 'A' },            // D3, F3, A3
            'G': { 3: 'Eb', 6: 'Gb', 10: 'Bb' },           // Eb3, Gb3, Bb3
            'Ab': { 4: 'E', 7: 'G', 11: 'B' },            // E3, G3, B3
            'A': { 5: 'F', 8: 'Ab', 0: 'C' },            // F3, Ab3, C4
            'Bb': { 6: 'F#', 9: 'A', 1: 'C#' },           // F#3, A3, C#4
            'B': { 7: 'G', 10: 'Bb', 2: 'D' }            // G3, Bb3, D4
        };
        
        // Check if this pitch class has a specific mapping for this key
        if (modeIII7EnharmonicMap[key] && modeIII7EnharmonicMap[key][pitchClass]) {
            console.log(`🎯 ${key}III7 custom mapping: pitch class ${pitchClass} -> ${modeIII7EnharmonicMap[key][pitchClass]}`);
            return modeIII7EnharmonicMap[key][pitchClass];
        }
    }
    
    // Special rule for ø7 chords (applies to both modes)
    if (chordType === 'ø7') {
        // ø7 chords: E, A, D, G, F, C use flats; F#, B, Db, Ab, Eb, Bb use sharps
        const flatKeysForDiminished = new Set(["E", "A", "D", "G", "F", "C"]);
        const sharpKeysForDiminished = new Set(["F#", "B", "Db", "Ab", "Eb", "Bb"]);
        
        if (flatKeysForDiminished.has(key)) {
            return PITCH_CLASSES_FLAT[pitchClass];
        } else if (sharpKeysForDiminished.has(key)) {
            return PITCH_CLASSES_SHARP[pitchClass];
        }
    }
    
    // 3. MODE III DIMINISHED CHORDS (ø7, ø7b13, ø7b13(♮3)) - Custom Enharmonic Mapping
    if (mode === 'III' && chordType === 'diminished') {
        console.log(`🎯 Special Mode III diminished rule triggered for key ${key}`);
        
        // Custom enharmonic mapping for Mode III ø7, ø7b13, and ø7b13(♮3) chords based on desired output
        const modeIIIDiminishedEnharmonicMap = {
            'C': { 3: 'Eb', 6: 'Gb', 10: 'Bb', 2: 'D', 4: 'E', 8: 'Ab' },           // Eb2, Gb2, Bb2, D3, E3, Ab3
            'Db': { 1: 'C#', 4: 'E', 7: 'G', 11: 'B', 3: 'Eb', 5: 'F', 9: 'A' },  // C#2, E2, G2, B2, Eb3, F3, A3
            'D': { 2: 'D', 5: 'F', 8: 'Ab', 0: 'C', 4: 'E', 6: 'F#', 10: 'Bb' },     // D2, F2, Ab2, C3, E3, F#3, Bb3
            'Eb': { 3: 'D#', 6: 'F#', 9: 'A', 1: 'C#', 5: 'F', 7: 'G', 11: 'B' },  // D#2, F#2, A2, C#3, F3, G3, B3
            'E': { 4: 'E', 7: 'G', 10: 'Bb', 2: 'D', 6: 'F#', 8: 'G#', 0: 'C' },   // E2, G2, Bb2, D3, F#3, G#3, C4
            'F': { 5: 'F', 8: 'Ab', 11: 'B', 3: 'Eb', 7: 'G', 9: 'A', 1: 'Db' },   // F2, Ab2, B2, Eb3, G3, A3, Db4
            'F#': { 6: 'F#', 9: 'A', 0: 'C', 4: 'E', 8: 'G#', 10: 'A#', 2: 'D' },   // F#2, A2, C3, E3, G#3, A#3, D4
            'G': { 7: 'G', 10: 'Bb', 1: 'Db', 5: 'F', 9: 'A', 11: 'B', 3: 'Eb' },   // G2, Bb2, Db3, F3, A3, B3, Eb4
            'Ab': { 8: 'G#', 11: 'B', 2: 'D', 6: 'F#', 10: 'Bb', 0: 'C', 4: 'E' }, // G#2, B2, D3, F#3, Bb3, C4, E4
            'A': { 9: 'A', 0: 'C', 3: 'Eb', 7: 'G', 11: 'B', 1: 'C#', 5: 'F' },    // A2, C3, Eb3, G3, B3, C#4, F4
            'Bb': { 10: 'A#', 1: 'C#', 4: 'E', 8: 'G#', 0: 'C', 2: 'D', 6: 'F#' }, // A#2, C#3, E3, G#3, C4, D4, F#4
            'B': { 11: 'B', 2: 'D', 5: 'F', 9: 'A', 1: 'C#', 3: 'D#', 7: 'G' }     // B1, D2, F2, A2, C#3, D#3, G3
        };
        
        // Check if this pitch class has a specific mapping for this key
        if (modeIIIDiminishedEnharmonicMap[key] && modeIIIDiminishedEnharmonicMap[key][pitchClass]) {
            console.log(`🎯 ${key}IIIø7 custom mapping: pitch class ${pitchClass} -> ${modeIIIDiminishedEnharmonicMap[key][pitchClass]}`);
            return modeIIIDiminishedEnharmonicMap[key][pitchClass];
        }
    }
    
    // Special rule for dominant chords: -7, -9, -9(#11), 7, 7/Δ7, 7/Δ7/#9
    if (chordType === 'minor-dominant') {
        // -7, -9, -9(#11) chords: Db is sharp key
        const flatKeysForMinorDominant = new Set(["Ab", "Eb", "Bb", "F", "C", "G"]);
        const sharpKeysForMinorDominant = new Set(["Db", "F#", "B", "E", "A", "D"]);
        
        if (flatKeysForMinorDominant.has(key)) {
            return PITCH_CLASSES_FLAT[pitchClass];
        } else if (sharpKeysForMinorDominant.has(key)) {
            return PITCH_CLASSES_SHARP[pitchClass];
        }
    } else if (chordType === 'major-dominant') {
        // 7, 7/Δ7, 7/Δ7/#9 chords: Db is flat key
        const flatKeysForMajorDominant = new Set(["Db", "Ab", "Eb", "Bb", "F", "C", "G"]);
        const sharpKeysForMajorDominant = new Set(["F#", "B", "E", "A", "D"]);
        
        if (flatKeysForMajorDominant.has(key)) {
            return PITCH_CLASSES_FLAT[pitchClass];
        } else if (sharpKeysForMajorDominant.has(key)) {
            return PITCH_CLASSES_SHARP[pitchClass];
        }
    }
    
    // Mode-dependent key classification
    if (mode === 'II') {
        // Mode II: C is sharp key for most chords, but flat key for 13 chords
        if (chordType === '13') {
            // Mode II 13 chords: C is flat key
            const modeII13FlatKeys = new Set(["C", "F", "Bb", "Eb", "Ab", "Db"]);
            const modeII13SharpKeys = new Set(["G", "D", "A", "E", "B", "F#"]);
            
            if (modeII13FlatKeys.has(key)) {
                return PITCH_CLASSES_FLAT[pitchClass];
            } else if (modeII13SharpKeys.has(key)) {
                return PITCH_CLASSES_SHARP[pitchClass];
            }
        } else if (chordType === 'II#9') {
            // X II#9 chords: specific key preferences for flats vs sharps
            const flatKeysForIISharp9 = new Set(["C", "Db", "E", "F", "G", "Ab", "Bb"]);
            const sharpKeysForIISharp9 = new Set(["D", "Eb", "F#", "A", "B"]);
            
            if (flatKeysForIISharp9.has(key)) {
                return PITCH_CLASSES_FLAT[pitchClass];
            } else if (sharpKeysForIISharp9.has(key)) {
                return PITCH_CLASSES_SHARP[pitchClass];
            }
        } else {
            // Mode II regular chords: C is sharp key
            const modeIIFlatKeys = new Set(["F", "Bb", "Eb", "Ab", "Db"]);
            const modeIISharpKeys = new Set(["C", "G", "D", "A", "E", "B", "F#"]);
            
            if (modeIIFlatKeys.has(key)) {
                return PITCH_CLASSES_FLAT[pitchClass];
            } else if (modeIISharpKeys.has(key)) {
                return PITCH_CLASSES_SHARP[pitchClass];
            }
        }
    } else if (mode === 'III') {
        // Mode III: C is flat key
        const modeIIIFlatKeys = new Set(["C", "F", "Bb", "Eb", "Ab", "Db"]);
        const modeIIISharpKeys = new Set(["G", "D", "A", "E", "B", "F#"]);
        
        if (modeIIIFlatKeys.has(key)) {
            return PITCH_CLASSES_FLAT[pitchClass];
        } else if (modeIIISharpKeys.has(key)) {
            return PITCH_CLASSES_SHARP[pitchClass];
        }
    } else if (mode === 'AD') {
        // Mode AD: C is flat key (similar to Mode III)
        const modeADFlatKeys = new Set(["C", "F", "Bb", "Eb", "Ab", "Db"]);
        const modeADSharpKeys = new Set(["G", "D", "A", "E", "B", "F#"]);
        
        if (modeADFlatKeys.has(key)) {
            return PITCH_CLASSES_FLAT[pitchClass];
        } else if (modeADSharpKeys.has(key)) {
            return PITCH_CLASSES_SHARP[pitchClass];
        }
    }
    
    // Fallback to regular key-aware logic
    if (FLAT_KEYS.has(key)) {
        return PITCH_CLASSES_FLAT[pitchClass];
    } else if (SHARP_KEYS.has(key)) {
        return PITCH_CLASSES_SHARP[pitchClass];
    } else {
        // Default to sharps for unknown keys
        return PITCH_CLASSES_SHARP[pitchClass];
    }
}

// Fix enharmonic conflicts (same pitch, different names) within the same octave
function fixEnharmonicConflictsEnhanced(chord, key = "C", chordType = null, mode = null) {
    console.log(`Enhanced letter name conflict check for chord in key ${key}:`, chord);
    
    // Group notes by octave
    const notesByOctave = {};
    chord.forEach(note => {
        if (note === '|') return; // Skip separator
        
        const [pitchClass, octave] = noteToPitch(note);
        if (pitchClass !== undefined && octave !== undefined) {
            const letterName = note[0]; // Extract letter name (C, D, E, F, G, A, B)
            if (!notesByOctave[octave]) notesByOctave[octave] = [];
            notesByOctave[octave].push({ note, pitchClass, letterName });
        }
    });
    
    // Check each octave for conflicts
    let hasConflicts = false;
    const fixedChord = chord.map(note => {
        if (note === '|') return note;
        
        const [pitchClass, octave] = noteToPitch(note);
        if (pitchClass === undefined || octave === undefined) return note;
        
        const letterName = note[0];
        const sameOctaveNotes = notesByOctave[octave] || [];
        
        // Look for letter name conflicts in the same octave
        const conflictingNote = sameOctaveNotes.find(n => 
            n.letterName === letterName && n.note !== note
        );
        
        if (conflictingNote) {
            hasConflicts = true;
            console.log(`Letter name conflict detected: ${note} and ${conflictingNote.note} both use letter '${letterName}' in octave ${octave}`);
            
            // Use BPP-style key-aware note representation
            const preferredNoteName = getNoteRepresentation(pitchClass, key, chordType, mode);
            const alternative = preferredNoteName + octave;
            
            console.log(`Converting ${note} to ${alternative} (key-aware representation for ${key})`);
            return alternative;
        }
        
        // Also check for exact pitch class conflicts (enharmonic equivalents)
        const enharmonicConflict = sameOctaveNotes.find(n => 
            n.pitchClass === pitchClass && n.note !== note
        );
        
        if (enharmonicConflict) {
            hasConflicts = true;
            console.log(`Enharmonic conflict detected: ${note} and ${enharmonicConflict.note} are the same pitch in octave ${octave}`);
            
            // Use BPP-style key-aware note representation
            const preferredNoteName = getNoteRepresentation(pitchClass, key, chordType, mode);
            const alternative = preferredNoteName + octave;
            
            console.log(`Converting ${note} to ${alternative} (key-aware representation for ${key})`);
            return alternative;
        }
        
        return note;
    });
    
    if (hasConflicts) {
        console.log(`Fixed conflicts using ${key} key preferences:`, fixedChord);
    } else {
        console.log('No conflicts found');
    }
    
    return fixedChord;
}

// Automatically adjust chord octave if it's too high or too low
function adjustChordOctave(chord, key = "C", chordType = null, mode = null) {
    console.log('Adjusting chord octave for:', chord);
    
    let currentChord = [...chord];
    let totalOctaveShift = 0;
    let maxAttempts = 5; // Prevent infinite loops
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        attempts++;
        console.log(`Adjustment attempt ${attempts}:`, currentChord);
        
        // Check if any note is out of range
        let hasHighNotes = false;
        let hasLowNotes = false;
        let hasLeftHandRangeIssues = false;
        let hasModeIIRangeIssues = false;
        
        // Check Mode II range constraint FIRST (highest priority)
        if (appState.selectedMode === 'II') {
            if (!isModeIIInRange(currentChord)) {
                hasModeIIRangeIssues = true;
            }
        }
        
        for (const note of currentChord) {
            if (note === '|') continue; // Skip separator
            
            const [pitchClass, octave] = noteToPitch(note);
            if (pitchClass === undefined || octave === undefined) continue;
            
            const absolutePitch = pitchClass + (octave * 12);
            if (absolutePitch > C5_PITCH) {
                hasHighNotes = true;
            }
            if (absolutePitch < D2_PITCH) {
                hasLowNotes = true;
            }
        }
        
        // Check left hand range constraint for Mode III and AD chords
        if ((appState.selectedMode === 'III' || appState.selectedMode === 'AD') && currentChord.includes('|')) {
            if (!isLeftHandInRange(currentChord)) {
                hasLeftHandRangeIssues = true;
            }
        }
        
        // If all notes are in range and all constraints are satisfied, we're done
        if (!hasHighNotes && !hasLowNotes && !hasLeftHandRangeIssues && !hasModeIIRangeIssues) {
            if (totalOctaveShift === 0) {
                console.log('No octave adjustment needed - chord is already in range');
            } else {
                console.log(`Final adjustment complete: total shift = ${totalOctaveShift} octave(s)`);
            }
            return currentChord;
        }
        
        // Determine octave shift based on out-of-range notes
        let octaveShift = 0;
        if (hasModeIIRangeIssues) {
            // Mode II range constraint has highest priority
            const separatorIndex = currentChord.indexOf('|');
            if (separatorIndex !== -1) {
                // For chords with hand separation, check if left hand is too high or too low
                const leftHandNotes = currentChord.slice(0, separatorIndex);
                let leftHandTooHigh = false;
                let leftHandTooLow = false;
                
                for (const note of leftHandNotes) {
                    const [pitchClass, octave] = noteToPitch(note);
                    if (pitchClass === undefined || octave === undefined) continue;
                    
                    const absolutePitch = pitchClass + (octave * 12);
                    if (absolutePitch > MODE_II_HIGH) {
                        leftHandTooHigh = true;
                    } else if (absolutePitch < MODE_II_LOW) {
                        leftHandTooLow = true;
                    }
                }
                
                if (leftHandTooHigh) {
                    octaveShift = -1;
                    console.log(`Attempt ${attempts}: Mode II left hand too high, transposing down 1 octave`);
                } else if (leftHandTooLow) {
                    octaveShift = 1;
                    console.log(`Attempt ${attempts}: Mode II left hand too low, transposing up 1 octave`);
                }
            } else {
                // For single-staff chords, check overall range
                let chordTooHigh = false;
                let chordTooLow = false;
                
                for (const note of currentChord) {
                    const [pitchClass, octave] = noteToPitch(note);
                    if (pitchClass === undefined || octave === undefined) continue;
                    
                    const absolutePitch = pitchClass + (octave * 12);
                    if (absolutePitch > MODE_II_HIGH) {
                        chordTooHigh = true;
                    } else if (absolutePitch < MODE_II_LOW) {
                        chordTooLow = true;
                    }
                }
                
                if (chordTooHigh) {
                    octaveShift = -1;
                    console.log(`Attempt ${attempts}: Mode II chord too high, transposing down 1 octave`);
                } else if (chordTooLow) {
                    octaveShift = 1;
                    console.log(`Attempt ${attempts}: Mode II chord too low, transposing up 1 octave`);
                }
            }
        } else if (hasHighNotes) {
            octaveShift = -1;
            console.log(`Attempt ${attempts}: Chord has high notes, transposing down 1 octave`);
        } else if (hasLowNotes) {
            octaveShift = 1;
            console.log(`Attempt ${attempts}: Chord has low notes, transposing up 1 octave`);
        } else if (hasLeftHandRangeIssues) {
            // Check if left hand is too high or too low
            const separatorIndex = currentChord.indexOf('|');
            if (separatorIndex !== -1) {
                const leftHandNotes = currentChord.slice(0, separatorIndex);
                let leftHandTooHigh = false;
                let leftHandTooLow = false;
                
                for (const note of leftHandNotes) {
                    const [pitchClass, octave] = noteToPitch(note);
                    if (pitchClass === undefined || octave === undefined) continue;
                    
                    const absolutePitch = pitchClass + (octave * 12);
                    if (absolutePitch > LEFT_HAND_HIGH) {
                        leftHandTooHigh = true;
                    } else if (absolutePitch < LEFT_HAND_LOW) {
                        leftHandTooLow = true;
                    }
                }
                
                if (leftHandTooHigh) {
                    octaveShift = -1;
                    console.log(`Attempt ${attempts}: Left hand too high, transposing down 1 octave`);
                } else if (leftHandTooLow) {
                    octaveShift = 1;
                    console.log(`Attempt ${attempts}: Left hand too low, transposing up 1 octave`);
                }
            }
        }
        
        // Apply octave shift
        currentChord = currentChord.map(note => {
            if (note === '|') return note;
            
            const [pitchClass, octave] = noteToPitch(note);
            if (pitchClass === undefined || octave === undefined) return note;
            
            const newOctave = octave + octaveShift;
            
            // Use key-aware note representation (same as transposeNote)
            const pitchName = getNoteRepresentation(pitchClass, key, chordType, mode);
            
            return `${pitchName}${newOctave}`;
        });
        
        totalOctaveShift += octaveShift;
        console.log(`After attempt ${attempts}:`, currentChord);
    }
    
    // If we exceeded max attempts, return the best we could do
    console.warn(`Warning: Exceeded maximum octave adjustment attempts (${maxAttempts}). Returning best result.`);
    return currentChord;
}

// Draw staff function with proper ABC.js rendering
function drawStaff(notes) {
    // Clear previous content
    const notationDiv = document.getElementById('notation');
    notationDiv.innerHTML = '';
    
    // Check if this is a Mode III or AD chord with hand separation, OR Mode II (treat Mode II like Mode III)
    const hasHandSeparation = notes.includes('|');
    
    if ((hasHandSeparation && (appState.selectedMode === 'III' || appState.selectedMode === 'AD')) || appState.selectedMode === 'II') {
        // Handle Mode II vs Mode III/AD differently
        if (appState.selectedMode === 'II') {
            // Mode II: Single staff with treble clef (treat like Mode III but single staff)
            const abcNotes = convertToABCWithAccidentals(notes);
            console.log(`🎼 Mode II - Original notes:`, notes);
            console.log(`🎼 Mode II - ABC notes:`, abcNotes);
            
            // Create ABC notation for Mode II: single staff with treble clef
            const abcNotation = `X:1
L:1/4
K:C
V:1 clef=treble
[${abcNotes.join('')}]4`;
            
            console.log(`🎼 Mode II - ABC notation:`, abcNotation);
            
            // Mode II should NOT use single-chord class - treat it like Mode III for consistency
            notationDiv.classList.remove('single-chord');
            console.log('🎯 Mode II: Removed single-chord class to match Mode III behavior');
            
            // Render Mode II with same robust approach as Mode III
            try {
                console.log('🎯 Mode II: Using robust ABC.js rendering (same as Mode III)');
                ABCJS.renderAbc(notationDiv, abcNotation, {
                    responsive: "resize",
                    scale: 1.0,
                    staffwidth: 450,
                    paddingleft: 15,
                    paddingright: 15,
                    paddingtop: 15,
                    paddingbottom: 15,
                    viewportHorizontal: true,
                    viewportVertical: true,
                    add_classes: true,
                    format: {
                        titlefont: "serif 14",
                        gchordfont: "serif 10",
                        vocalfont: "serif 11",
                        annotationfont: "serif 10",
                        historyfont: "serif 14",
                        infofont: "serif 10",
                        measurefont: "serif 10",
                        partsfont: "serif 10",
                        repeatfont: "serif 10",
                        textfont: "serif 10",
                        voicefont: "serif 10",
                        wordsfont: "serif 10"
                    },
                    wrap: {
                        minSpacing: 1.6,
                        maxSpacing: 2.4,
                        preferredMeasuresPerLine: 16
                    }
                });
                
                console.log(`✅ Mode II: ABC.js rendered successfully with single staff`);
                
                // Apply post-render styling for Mode II - EXACTLY like Mode III (centered, no right-side positioning)
                setTimeout(() => {
                    const svg = notationDiv.querySelector('svg');
                    if (svg) {
                        // Mode II: Keep centered like Mode III (no right-side positioning)
                        svg.style.marginLeft = 'auto';
                        svg.style.marginRight = 'auto';
                        svg.style.display = 'block';
                        svg.style.float = 'none';
                        
                        // Fix sizing issues for Mode II chords - ensure consistent dimensions
                        svg.style.width = '450px';
                        svg.style.height = 'auto';
                        svg.style.maxWidth = '450px';
                        svg.style.minWidth = '450px';
                        
                        // Apply the white filter
                        svg.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))';
                        
                        console.log('🎯 Mode II: Single chord staff kept centered like Mode III (no smooth transitions)!');
                    } else {
                        console.error('❌ Mode II: No SVG found for single chord staff positioning');
                    }
                }, 100);
                
                return; // Exit early for Mode II
            } catch (error) {
                console.error(`❌ Mode II: Error rendering ABC:`, error);
                notationDiv.innerHTML = `<p style="color: red;">Error rendering staff: ${error.message}</p>`;
                return;
            }
        }
        
        // Mode III/AD: Split notes into left and right hand
        const separatorIndex = notes.indexOf('|');
        const leftHandNotes = notes.slice(0, separatorIndex);
        const rightHandNotes = notes.slice(separatorIndex + 1);
        
        // Convert notes to ABC format
        const leftHandABC = convertToABCWithAccidentals(leftHandNotes);
        const rightHandABC = convertToABCWithAccidentals(rightHandNotes);
        
        console.log(`🎼 Mode III/AD - Original notes:`, notes);
        console.log(`🎼 Mode III/AD - Left hand (bass):`, leftHandNotes);
        console.log(`🎼 Mode III/AD - Right hand (treble):`, rightHandNotes);
        console.log(`🎼 Mode III/AD - Left hand ABC:`, leftHandABC);
        console.log(`🎼 Mode III/AD - Right hand ABC:`, rightHandABC);
        
        // Create ABC notation with two staves
        const abcNotation = `X:1
L:1/4
K:C
V:1 clef=treble
[${rightHandABC.join('')}]4
V:2 clef=bass
[${leftHandABC.join('')}]4`;
        
        console.log(`🎼 Mode III/AD - ABC notation:`, abcNotation);
        
        // Remove single-chord class for two-staff chords
        notationDiv.classList.remove('single-chord');
        console.log('🎯 Removed single-chord class for two-staff chord');
        
        // Render with ABC.js
        try {
            console.log('🚨🚨🚨 BEFORE ABC.js render - about to call ABCJS.renderAbc ��🚨🚨');
            // FIRST ABC.js RENDER CALL - Two staves
            ABCJS.renderAbc(notationDiv, abcNotation, {
                responsive: "resize",
                scale: 1.0,
                staffwidth: 450,
                paddingleft: 15,
                paddingright: 15,
                paddingtop: 15,
                paddingbottom: 15,
                viewportHorizontal: true,
                viewportVertical: true,
                add_classes: true,
                format: {
                    titlefont: "serif 14",
                    gchordfont: "serif 10",
                    vocalfont: "serif 11",
                    annotationfont: "serif 10",
                    historyfont: "serif 14",
                    infofont: "serif 10",
                    measurefont: "serif 10",
                    partsfont: "serif 10",
                    repeatfont: "serif 10",
                    textfont: "serif 10",
                    voicefont: "serif 10",
                    wordsfont: "serif 10"
                },
                wrap: {
                    minSpacing: 1.6,
                    maxSpacing: 2.4,
                    preferredMeasuresPerLine: 16
                }
            });
            
            console.log(`✅ ABC.js rendered successfully with two staves`);
            console.log(`Staff drawn successfully with notes:`, notes);
            
            // Apply post-render styling for two-staff chords - maintain center position
            setTimeout(() => {
                const svg = notationDiv.querySelector('svg');
                if (svg) {
                    // Keep two-staff chords centered (for neighbors display)
                    svg.style.marginLeft = 'auto';
                    svg.style.marginRight = 'auto';
                    svg.style.display = 'block';
                    svg.style.float = 'none';
                    
                    // Apply the white filter
                    svg.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))';
                    
                    console.log('🎯 Two-staff chord staff kept centered!');
                }
            }, 100);
        } catch (error) {
            console.error(`❌ Error rendering ABC:`, error);
            notationDiv.innerHTML = `<p style="color: red;">Error rendering staff: ${error.message}</p>`;
        }
    }
}

// Convert notes to ABC notation with proper accidental handling (from BPP)
function convertToABCWithAccidentals(notes) {
    const accidentalState = {}; // Track accidentals by pitch class AND octave
    
    return notes.map(note => {
        // Skip separator characters
        if (note === '|') {
            return null;
        }
        
        const noteName = note.slice(0, -1);
        const octave = parseInt(note.slice(-1));
        
        const pitchClass = noteName[0]; // Base pitch class (C, D, E, F, G, A, B)
        const currentAccidental = noteName.length > 1 ? noteName[1] : null;
        
        // Create key that includes both pitch class and octave
        const accidentalKey = `${pitchClass}${octave}`;
        
        let baseNote = pitchClass.toLowerCase();
        let accidentalSymbol = "";
        
        // Determine what accidental symbol to use based on current state
        if (currentAccidental === "#") {
            if (accidentalState[accidentalKey] !== "#") {
                accidentalSymbol = "^"; // Sharp
                accidentalState[accidentalKey] = "#";
            }
        } else if (currentAccidental === "b") {
            if (accidentalState[accidentalKey] !== "b") {
                accidentalSymbol = "_"; // Flat
                accidentalState[accidentalKey] = "b";
            }
        } else {
            // Natural note - only add natural sign if we need to cancel a previous accidental
            if (accidentalState[accidentalKey] === "#" || accidentalState[accidentalKey] === "b") {
                accidentalSymbol = "="; // Natural (cancels previous accidental)
                accidentalState[accidentalKey] = "natural";
            }
        }
        
        // Apply accidental symbol
        if (accidentalSymbol) {
            baseNote = accidentalSymbol + baseNote;
        }
        
        // Handle octaves relative to octave 4 (middle octave in ABC)
        if (octave >= 5) {
            // Higher octaves use apostrophes
            const apostrophes = "'".repeat(octave - 4);
            baseNote = baseNote + apostrophes;
        } else if (octave === 4) {
            // Octave 4 stays as is (lowercase)
            baseNote = baseNote;
        } else if (octave === 3) {
            // Octave 3 uses uppercase
            baseNote = baseNote.toUpperCase();
        } else if (octave <= 2) {
            // Lower octaves use commas
            baseNote = baseNote.toUpperCase();
            const commas = ",".repeat(3 - octave);
            baseNote = baseNote + commas;
        }
        
        return baseNote;
    }).filter(note => note !== null); // Remove null values (separators)
}

// Function to display a chord (called when Generate Chord button is clicked)
function displayChord(chordName) {
    console.log('🎯 Displaying chord:', chordName);
    
    // Extract the key from the chord name
    const keyMatch = chordName.match(/^([A-Z][#b]?)/);
    if (!keyMatch) {
        console.error('Could not extract key from chord name:', chordName);
        return;
    }
    const preferredPitch = keyMatch[1];
    
    // Get the original voicing in C
    let originalVoicing;
    if (appState.selectedMode === 'AD') {
        const chordTypeKey = chordName.includes('AD1') ? 'AD1' : 'AD5';
        originalVoicing = adChordVoicings[chordTypeKey][preferredPitch];
        if (!originalVoicing) {
            console.error(`No voicing found for ${preferredPitch} ${chordTypeKey}`);
            return;
        }
    } else {
        // Find the original C voicing
        let cChordName;
        if (appState.selectedMode === 'II') {
            if (chordName.includes('II6')) cChordName = 'CII6';
            else if (chordName.includes('II#11')) cChordName = 'CII#11';
            else if (chordName.includes('II13')) cChordName = 'CII13';
            else if (chordName.includes('II#9')) cChordName = 'CII#9';
        } else if (appState.selectedMode === 'III') {
            if (chordName.includes('ø7b13(♮3)')) cChordName = 'CIIIø7b13(♮3)';
            else if (chordName.includes('ø7b13')) cChordName = 'CIIIø7b13';
            else if (chordName.includes('ø7')) cChordName = 'CIIIø7';
            else if (chordName.includes('-9(#11)')) cChordName = 'CIII-9(#11)';
            else if (chordName.includes('-9')) cChordName = 'CIII-9';
            else if (chordName.includes('-7')) cChordName = 'CIII-7';
            else if (chordName.includes('7/Δ7/#9')) cChordName = 'CIII7/Δ7/#9';
            else if (chordName.includes('7/Δ7')) cChordName = 'CIII7/Δ7';
            else if (chordName.includes('7') && !chordName.includes('ø7')) cChordName = 'CIII7';
        }
        
        if (!cChordName) {
            console.error('Could not determine C chord name for:', chordName);
            return;
        }
        
        originalVoicing = chordVoicings[appState.selectedMode][cChordName];
    }
    
    if (!originalVoicing) {
        console.error('No original voicing found for chord:', chordName);
        return;
    }
    
    // Detect chord type for special notation rules
    const isDiminished7 = chordName.includes('ø7');
    const isMinorDominant = chordName.includes('-7') || chordName.includes('-9');
    const isMajorDominant = chordName.includes('7') && !chordName.includes('ø7') && !chordName.includes('-7') && !chordName.includes('-9');
    const is13Chord = chordName.includes('13');
    const isADChord = chordName.includes('AD');
    const isIISharp9 = chordName.includes('II#9');
    
    let chordType = null;
    if (isDiminished7) {
        chordType = appState.selectedMode === 'III' ? 'diminished' : 'ø7';
    } else if (isMinorDominant) {
        chordType = 'minor-dominant';
    } else if (isMajorDominant) {
        chordType = 'major-dominant';
    } else if (is13Chord) {
        chordType = '13';
    } else if (isADChord) {
        chordType = 'AD';
    } else if (isIISharp9) {
        chordType = 'II#9';
    }
    
    // Get the pitch class for transposition
    const randomPitchIndex = pitchClasses[preferredPitch];
    
    // Calculate transposition semitones (C = 0, so target pitch number is the semitones to transpose)
    const transpositionSemitones = randomPitchIndex;
    
    // Transpose the voicing (only for Mode II and III, not for AD)
    let transposedVoicing;
    if (appState.selectedMode === 'AD') {
        transposedVoicing = [...originalVoicing];
    } else {
        transposedVoicing = transposeChord(originalVoicing, transpositionSemitones, preferredPitch, chordType, appState.selectedMode);
    }
    
    // Apply intelligent octave adjustment if needed (F2 to C5 range)
    const octaveAdjustedVoicing = adjustChordOctave(transposedVoicing, preferredPitch, chordType, appState.selectedMode);
    
    // Fix enharmonic conflicts within the same octave
    const enharmonicFixedVoicing = fixEnharmonicConflictsEnhanced(octaveAdjustedVoicing, preferredPitch, chordType, appState.selectedMode);
    
    // Determine mode transposition
    let transpositionInfo;
    if (appState.selectedMode === 'AD') {
        transpositionInfo = '-'; // AD mode always shows "-"
    } else {
        transpositionInfo = getModeTransposition(preferredPitch, appState.selectedMode);
    }
    
    // Display results
    document.getElementById('chord-display').textContent = chordName;
    
    // Update mode transposition display
    document.getElementById('transposition-status-display').textContent = transpositionInfo;
    
    // Reset neighbors state when displaying a new chord
    appState.neighborsDisplayed = false;
    appState.currentChordWithNeighbors = null;
    
    // Reset neighbors button to "Neighbors" and enable it (except for AD mode)
    const neighborsBtn = document.getElementById('neighbors-btn');
    if (neighborsBtn) {
        neighborsBtn.textContent = 'Neighbors';
        neighborsBtn.classList.remove('active');
        // For AD mode, always keep neighbors button disabled
        if (appState.selectedMode === 'AD') {
            neighborsBtn.disabled = true;
        } else {
            neighborsBtn.disabled = false; // Enable when chord is displayed
        }
    }
    
    // Store current chord for neighbors functionality
    appState.currentChord = chordName;
    
    // Draw the chord on staff
    drawStaff(enharmonicFixedVoicing);
}