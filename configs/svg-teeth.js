window.exampleTeethData = [
    // Oberkiefer Rechts (Quadrant 1)
    {
        id: '18', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },       // Original 'top'
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },       // Original 'left'
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' }, // Original 'bottom'
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },     // Original 'right'
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' }, // Original 'center'
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '0,30 5,50 10,30' }, // mesiobukkal
            { id: 'root-2', points: '10,30 15,50 20,30' }, // palatinal
            { id: 'root-3', points: '20,30 25,50 30,30' }   // distobukkal
        ]
    },
    {
        id: '17', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '0,30 5,50 10,30' },
            { id: 'root-2', points: '10,30 15,50 20,30' },
            { id: 'root-3', points: '20,30 25,50 30,30' }
        ]
    },
    {
        id: '16', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '0,30 5,50 10,30' },
            { id: 'root-2', points: '10,30 15,50 20,30' },
            { id: 'root-3', points: '20,30 25,50 30,30' }
        ]
    },
    {
        id: '15', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' }, // bukkal
            { id: 'root-2', points: '15,30 20,50 25,30' }   // palatinal
        ]
    },
    {
        id: '14', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    {
        id: '13', type: 'canine', surfaces: [
            { id: 'labial', points: '5,0 25,0 20,10 10,10' }, // Original 'top' adapted for canine shape
            { id: 'distal', points: '0,5 10,10 10,20 0,25' }, // Original 'left'
            { id: 'palatinal', points: '5,30 10,20 20,20 25,30' },// Original 'bottom' adapted
            { id: 'mesial', points: '30,5 20,10 20,20 30,25' },    // Original 'right'
            { id: 'incisal', points: '10,10 20,10 20,20 10,20' }, // Original 'center', representing incisal edge/area
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '12', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },     // Original 'top'
            { id: 'distal', points: '0,10 10,10 10,20 0,20' },     // Original 'left'
            { id: 'palatinal', points: '10,15 20,15 20,30 10,30' },// Original 'bottom'
            { id: 'mesial', points: '20,10 30,10 30,20 20,20' },   // Original 'right'
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' }, // Original 'center'
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '11', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },
            { id: 'distal', points: '0,10 10,10 10,20 0,20' },
            { id: 'palatinal', points: '10,15 20,15 20,30 10,30' },
            { id: 'mesial', points: '20,10 30,10 30,20 20,20' },
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    // Oberkiefer Links (Quadrant 2)
    {
        id: '21', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },
            { id: 'mesial', points: '0,10 10,10 10,20 0,20' },     // Original 'left' is MESIAL for Q2
            { id: 'palatinal', points: '10,15 20,15 20,30 10,30' },// Original 'bottom'
            { id: 'distal', points: '20,10 30,10 30,20 20,20' },   // Original 'right' is DISTAL for Q2
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' }, // Original 'center'
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '22', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },
            { id: 'mesial', points: '0,10 10,10 10,20 0,20' },
            { id: 'palatinal', points: '10,15 20,15 20,30 10,30' },
            { id: 'distal', points: '20,10 30,10 30,20 20,20' },
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '23', type: 'canine', surfaces: [
            { id: 'labial', points: '5,0 25,0 20,10 10,10' },
            { id: 'mesial', points: '0,5 10,10 10,20 0,25' },
            { id: 'palatinal', points: '5,30 10,20 20,20 25,30' },
            { id: 'distal', points: '30,5 20,10 20,20 30,25' },
            { id: 'incisal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '24', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    {
        id: '25', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    {
        id: '26', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '0,30 5,50 10,30' },
            { id: 'root-2', points: '10,30 15,50 20,30' },
            { id: 'root-3', points: '20,30 25,50 30,30' }
        ]
    },
    {
        id: '27', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '0,30 5,50 10,30' },
            { id: 'root-2', points: '10,30 15,50 20,30' },
            { id: 'root-3', points: '20,30 25,50 30,30' }
        ]
    },
    {
        id: '28', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'palatinal', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '0,30 5,50 10,30' },
            { id: 'root-2', points: '10,30 15,50 20,30' },
            { id: 'root-3', points: '20,30 25,50 30,30' }
        ]
    },
    // Unterkiefer Links (Quadrant 3)
    {
        id: '38', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },   // Original 'left' is MESIAL for Q3
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' }, // Original 'bottom'
            { id: 'distal', points: '30,0 20,10 20,20 30,30' }, // Original 'right' is DISTAL for Q3
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' }, // mesial
            { id: 'root-2', points: '15,30 20,50 25,30' }   // distal
        ]
    },
    {
        id: '37', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    {
        id: '36', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    {
        id: '35', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '34', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'mesial', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'distal', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '33', type: 'canine', surfaces: [
            { id: 'labial', points: '5,0 25,0 20,10 10,10' },
            { id: 'mesial', points: '0,5 10,10 10,20 0,25' },
            { id: 'lingual', points: '5,30 10,20 20,20 25,30' },
            { id: 'distal', points: '30,5 20,10 20,20 30,25' },
            { id: 'incisal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '32', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },
            { id: 'mesial', points: '0,10 10,10 10,20 0,20' },
            { id: 'lingual', points: '10,15 20,15 20,30 10,30' },
            { id: 'distal', points: '20,10 30,10 30,20 20,20' },
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '31', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },
            { id: 'mesial', points: '0,10 10,10 10,20 0,20' },
            { id: 'lingual', points: '10,15 20,15 20,30 10,30' },
            { id: 'distal', points: '20,10 30,10 30,20 20,20' },
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    // Unterkiefer Rechts (Quadrant 4)
    {
        id: '41', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },     // Original 'top'
            { id: 'distal', points: '0,10 10,10 10,20 0,20' },     // Original 'left' is DISTAL for Q4
            { id: 'lingual', points: '10,15 20,15 20,30 10,30' }, // Original 'bottom'
            { id: 'mesial', points: '20,10 30,10 30,20 20,20' },   // Original 'right' is MESIAL for Q4
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' }, // Original 'center'
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '42', type: 'incisor', surfaces: [
            { id: 'labial', points: '10,0 20,0 20,15 10,15' },
            { id: 'distal', points: '0,10 10,10 10,20 0,20' },
            { id: 'lingual', points: '10,15 20,15 20,30 10,30' },
            { id: 'mesial', points: '20,10 30,10 30,20 20,20' },
            { id: 'incisal', points: '10,10 15,12.5 20,15 15,17.5 10,15' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '43', type: 'canine', surfaces: [
            { id: 'labial', points: '5,0 25,0 20,10 10,10' },
            { id: 'distal', points: '0,5 10,10 10,20 0,25' },
            { id: 'lingual', points: '5,30 10,20 20,20 25,30' },
            { id: 'mesial', points: '30,5 20,10 20,20 30,25' },
            { id: 'incisal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '44', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '45', type: 'premolar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '10,30 15,50 20,30' }
        ]
    },
    {
        id: '46', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    {
        id: '47', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    {
        id: '48', type: 'molar', surfaces: [
            { id: 'buccal', points: '0,0 30,0 20,10 10,10' },
            { id: 'distal', points: '0,0 10,10 10,20 0,30' },
            { id: 'lingual', points: '0,30 10,20 20,20 30,30' },
            { id: 'mesial', points: '30,0 20,10 20,20 30,30' },
            { id: 'occlusal', points: '10,10 20,10 20,20 10,20' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '5,30 10,50 15,30' },
            { id: 'root-2', points: '15,30 20,50 25,30' }
        ]
    },
    // --- Milchteeth (Quadrant 5 - OK Rechts Betrachter) ---
    // Using scaled down versions of permanent teeth for simplicity
    // Adjust points for actual milk tooth anatomy if needed. Scale factor ~0.8
    {
        id: '55', type: 'milk-molar', surfaces: [ // Similar to 15 (premolar used as base for 2nd milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'distal', points: '0,0 8,8 8,16 0,24' },
            { id: 'palatinal', points: '0,24 8,16 16,16 24,24' },
            { id: 'mesial', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    },
    {
        id: '54', type: 'milk-molar', surfaces: [ // Similar to 14 (premolar used as base for 1st milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'distal', points: '0,0 8,8 8,16 0,24' },
            { id: 'palatinal', points: '0,24 8,16 16,16 24,24' },
            { id: 'mesial', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    },
    {
        id: '53', type: 'milk-canine', surfaces: [ // Similar to 13
            { id: 'labial', points: '4,0 20,0 16,8 8,8' },
            { id: 'distal', points: '0,4 8,8 8,16 0,20' },
            { id: 'palatinal', points: '4,24 8,16 16,16 20,24' },
            { id: 'mesial', points: '24,4 16,8 16,16 24,20' },
            { id: 'incisal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '52', type: 'milk-incisor', surfaces: [ // Similar to 12
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'distal', points: '0,8 8,8 8,16 0,16' },
            { id: 'palatinal', points: '8,12 16,12 16,24 8,24' },
            { id: 'mesial', points: '16,8 24,8 24,16 16,16' },
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '51', type: 'milk-incisor', surfaces: [ // Similar to 11
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'distal', points: '0,8 8,8 8,16 0,16' },
            { id: 'palatinal', points: '8,12 16,12 16,24 8,24' },
            { id: 'mesial', points: '16,8 24,8 24,16 16,16' },
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    // --- Milchteeth (Quadrant 6 - OK Links Betrachter) ---
    {
        id: '61', type: 'milk-incisor', surfaces: [ // Similar to 21
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'mesial', points: '0,8 8,8 8,16 0,16' }, // Mesial for Q6
            { id: 'palatinal', points: '8,12 16,12 16,24 8,24' },
            { id: 'distal', points: '16,8 24,8 24,16 16,16' }, // Distal for Q6
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '62', type: 'milk-incisor', surfaces: [ // Similar to 22
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'mesial', points: '0,8 8,8 8,16 0,16' },
            { id: 'palatinal', points: '8,12 16,12 16,24 8,24' },
            { id: 'distal', points: '16,8 24,8 24,16 16,16' },
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '63', type: 'milk-canine', surfaces: [ // Similar to 23
            { id: 'labial', points: '4,0 20,0 16,8 8,8' },
            { id: 'mesial', points: '0,4 8,8 8,16 0,20' },
            { id: 'palatinal', points: '4,24 8,16 16,16 20,24' },
            { id: 'distal', points: '24,4 16,8 16,16 24,20' },
            { id: 'incisal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '64', type: 'milk-molar', surfaces: [ // Similar to 24 (premolar used as base for 1st milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'mesial', points: '0,0 8,8 8,16 0,24' },
            { id: 'palatinal', points: '0,24 8,16 16,16 24,24' },
            { id: 'distal', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    },
    {
        id: '65', type: 'milk-molar', surfaces: [ // Similar to 25 (premolar used as base for 2nd milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'mesial', points: '0,0 8,8 8,16 0,24' },
            { id: 'palatinal', points: '0,24 8,16 16,16 24,24' },
            { id: 'distal', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    },

    // --- Milchteeth (Quadrant 7 - UK Links Betrachter) ---
    {
        id: '71', type: 'milk-incisor', surfaces: [ // Similar to 31
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'mesial', points: '0,8 8,8 8,16 0,16' }, // Mesial for Q7
            { id: 'lingual', points: '8,12 16,12 16,24 8,24' },
            { id: 'distal', points: '16,8 24,8 24,16 16,16' }, // Distal for Q7
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '72', type: 'milk-incisor', surfaces: [ // Similar to 32
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'mesial', points: '0,8 8,8 8,16 0,16' },
            { id: 'lingual', points: '8,12 16,12 16,24 8,24' },
            { id: 'distal', points: '16,8 24,8 24,16 16,16' },
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '73', type: 'milk-canine', surfaces: [ // Similar to 33
            { id: 'labial', points: '4,0 20,0 16,8 8,8' },
            { id: 'mesial', points: '0,4 8,8 8,16 0,20' },
            { id: 'lingual', points: '4,24 8,16 16,16 20,24' },
            { id: 'distal', points: '24,4 16,8 16,16 24,20' },
            { id: 'incisal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '74', type: 'milk-molar', surfaces: [ // Similar to 34 (premolar used as base for 1st milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'mesial', points: '0,0 8,8 8,16 0,24' },
            { id: 'lingual', points: '0,24 8,16 16,16 24,24' },
            { id: 'distal', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    },
    {
        id: '75', type: 'milk-molar', surfaces: [ // Similar to 35 (premolar used as base for 2nd milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'mesial', points: '0,0 8,8 8,16 0,24' },
            { id: 'lingual', points: '0,24 8,16 16,16 24,24' },
            { id: 'distal', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    },

    // --- Milchteeth (Quadrant 8 - UK Rechts Betrachter) ---
    {
        id: '81', type: 'milk-incisor', surfaces: [ // Similar to 41
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'distal', points: '0,8 8,8 8,16 0,16' }, // Distal for Q8
            { id: 'lingual', points: '8,12 16,12 16,24 8,24' },
            { id: 'mesial', points: '16,8 24,8 24,16 16,16' }, // Mesial for Q8
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '82', type: 'milk-incisor', surfaces: [ // Similar to 42
            { id: 'labial', points: '8,0 16,0 16,12 8,12' },
            { id: 'distal', points: '0,8 8,8 8,16 0,16' },
            { id: 'lingual', points: '8,12 16,12 16,24 8,24' },
            { id: 'mesial', points: '16,8 24,8 24,16 16,16' },
            { id: 'incisal', points: '8,8 12,10 16,12 12,14 8,12' },
            { id: 'crown_outline', points: '4.4,-3.6 19.6,-3.6 19.6,24.4 4.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '83', type: 'milk-canine', surfaces: [ // Similar to 43
            { id: 'labial', points: '4,0 20,0 16,8 8,8' },
            { id: 'distal', points: '0,4 8,8 8,16 0,20' },
            { id: 'lingual', points: '4,24 8,16 16,16 20,24' },
            { id: 'mesial', points: '24,4 16,8 16,16 24,20' },
            { id: 'incisal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '0.4,-3.6 23.6,-3.6 23.6,24.4 0.4,24.4' },
            { id: 'root-1', points: '8,24 12,40 16,24' }
        ]
    },
    {
        id: '84', type: 'milk-molar', surfaces: [ // Similar to 44 (premolar used as base for 1st milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'distal', points: '0,0 8,8 8,16 0,24' },
            { id: 'lingual', points: '0,24 8,16 16,16 24,24' },
            { id: 'mesial', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    },
    {
        id: '85', type: 'milk-molar', surfaces: [ // Similar to 45 (premolar used as base for 2nd milk molar)
            { id: 'buccal', points: '0,0 24,0 16,8 8,8' },
            { id: 'distal', points: '0,0 8,8 8,16 0,24' },
            { id: 'lingual', points: '0,24 8,16 16,16 24,24' },
            { id: 'mesial', points: '24,0 16,8 16,16 24,24' },
            { id: 'occlusal', points: '8,8 16,8 16,16 8,16' },
            { id: 'crown_outline', points: '-3.6,-3.6 27.6,-3.6 27.6,24.4 -3.6,24.4' },
            { id: 'root-1', points: '4,24 8,40 12,24' },
            { id: 'root-2', points: '12,24 16,40 20,24' }
        ]
    }
];