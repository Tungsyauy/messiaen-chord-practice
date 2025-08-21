# Chord Practice Application

A JavaScript-based chord practice tool inspired by Messiaen's harmonic concepts, featuring two distinct modes for practicing different chord types.

## Features

### Mode II Chords
- **CII6** - Major sixth chord
- **CII#11** - Major chord with sharp eleventh
- **CII13** - Major thirteenth chord

### Mode III Chords
- **CIII-7** - Minor seventh chord
- **CIII-9** - Minor ninth chord
- **CIII-9(#11)** - Minor ninth with sharp eleventh
- **CIII7** - Dominant seventh chord
- **CIII7/Δ7** - Dominant seventh with major seventh
- **CIII7/Δ7/#9** - Dominant seventh with major seventh and sharp ninth
- **CIIIø7** - Half-diminished seventh chord
- **CIIIø7b13** - Half-diminished seventh with flat thirteenth
- **CIIIø7b13(♮3)** - Half-diminished seventh with flat thirteenth and natural third

## How It Works

1. **Random Pitch Selection**: The application randomly selects from all 12 chromatic pitches (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
2. **Chord Generation**: For each mode, it randomly selects one of the available chord types
3. **Final Display**: The root pitch 'C' in the chord name is replaced with the randomly selected pitch

## Usage

1. Open `index.html` in any modern web browser
2. Select between Mode II and Mode III using the toggle buttons
3. Click "Generate Chord" to create a random chord
4. The generated chord will be displayed prominently
5. The current random pitch and available chord types for the selected mode are shown in the info panel

## Technical Details

- **Pure JavaScript**: No external dependencies required
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Real-time Updates**: Chord list updates automatically when switching modes

## Example Outputs

**Mode II Examples:**
- F#II6
- BII#11
- DII13

**Mode III Examples:**
- GIII-7
- A#III7/Δ7/#9
- C#IIIø7b13(♮3)

## Getting Started

Simply open the `index.html` file in your web browser to start practicing chords immediately. No installation or setup required. 