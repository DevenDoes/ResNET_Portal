function main() {
    let month = randomData();
    let semester = randomData();
    barGraph(month, ["tickets_month_hori", "column", "flex-end", "200", "25", "50", 'desc', 'key_hori']);
    barGraph(semester, ["tickets_semester_hori", "column", "flex-start", "200", "25", "50", 'desc']);
    barGraph(month, ["tickets_month_vert", "row", "flex-end", "200", "25", "50", 'desc', 'key_vert']);
    barGraph(semester, ["tickets_semester_vert", "row", "flex-end", "200", "25", "50", 'desc']);
}

/*
*
* Function for scaling bar graphs relative to one another
*
* data (array): the data to be displayed
* props (array):
*   [0]: parent (string): html id of graph wrapper div
*   [1]: direction (string): flex-direction (row, column)
*   [2]: alignment (string): align-items (flex-start, flex-end)
*   [3]: max (string): max bar length in pixels
*   [4]: min (string): min bar length in pixels
*   [5]: width (string): width of each bar in pixels
*   [6]: sort (string): data sort order (asc, desc)
*   [7]: key (string): html id of graph key wrapper div
*
*/

function barGraph(data, props) {

    // Parse JSON graph data and sort it in descending order
    data = JSON.parse(data);

    // Update graph key if provided
    if(props[7])
        updateGraphKey(props[7], data.map( x => [x.name, x.color]));

    // Find max data element
    let maxData = data.concat().sort(function(a,b) {
        return b.count - a.count || a.priority - b.priority;
    })[0];

    // Sort graph data in ascending order
    if(props[6] == 'asc')
        data.sort(function(a,b) {
            return a.count - b.count || a.priority - b.priority;
        });

    // Sort graph data in descending order
    else if(props[6] == 'desc')
        data.sort(function(a,b) {
            return b.count - a.count || a.priority - b.priority;
        });

    // Select graph elements from DOM
    let graph = $("#" + props[0]);
    let bars = graph.children('div');

    // Set graph CSS properties
    graph.css({
        'flex-direction' : props[1],
        'align-items' : props[2],
    });

    // Set bar and key CSS properties
    for(let i = 0; i < bars.length; i++) {

        // Assign first bar to max length if it has a count greater than zero
        if(maxData == data[i] && data[i].count != 0)
            // Set height or width depending on graph direction
            props[1] == "row" ? bars[i].style.height = props[3] + 'px' : bars[i].style.width = props[3] + 'px';

        else {
            // Calculate bar length relative to the max bar length
            // scale = max length * (current bar count / max bar count)
            let scale = props[3] * (data[i].count / maxData.count);
            // If the relative bar length is less than the min bar length set the bar length equal to min

            if(scale < props[4])
                // Set height or width depending on graph direction
                props[1] == "row" ? bars[i].style.height = $(bars[i].children[0]).innerWidth() + 'px' : bars[i].style.width = $(bars[i].children[0]).innerWidth() + 'px';

            // If the relative bar length is greater than or equal to the min bar length set it
            else
                // Set height or width depending on graph direction
                props[1] == "row" ? bars[i].style.height = scale : bars[i].style.width = scale;

        }

        // Set bar color
        bars[i].style.backgroundColor = data[i].color;
        // Set bar paragraph text to count
        bars[i].children[0].innerHTML = data[i].count;
        // Set bar paragraph text alignment
        if(props[1] == "row") {
            // Set bar properties if flex-direction is row
            $(bars[i]).css({
                // Set bar width
                'width' : props[5] + 'px',
                // Set bar background-color
                'background-color' : data[i].color,
                // Set bar spacing
                'margin-right' : '10px',
                // Set bar flex-direction to row
                'flex-direction' : 'row',
                // Set bar align-items to flex-start or flex-end dependent on graph alignment
                'align-items' : props[2] == "flex-start" ? "flex-start" : "flex-end",
            });

            // Set bar text properties if flex-direction is row
            $(bars[i].children[0]).css({
                // Align the text left or right dependent on graph alignment
                'text-align' : 'center',
                // Vertical align text top or bottom dependent on graph alignment
                'vertical-align' : props[2] == "flex-start" ? "top" : "bottom",
                // Pad the text left or right dependent on graph alignment
                'padding' : '10px 0px 10px 0px',
                // Set text width to bar width
                'width' : props[5],
            });

            //Correct bar height to fit overflowed text
            if($(bars[i]).height() < $(bars[i].children[0]).outerHeight(true))
                $(bars[i]).css({'height' : $(bars[i].children[0]).outerHeight(true) + 'px'});

        }

        else {
            // Set bar properties if flex-direction is column
            $(bars[i]).css({
                // Set bar width
                'height' : props[5] + 'px',
                // Set bar background-color
                'background-color' : data[i].color,
                // Set bar spacing
                'margin-bottom' : '10px',
                // Set bar flex-direction to row
                'flex-direction' : 'column',
                // Set bar align-items to flex-start or flex-end dependent on graph alignment
                'align-items' : props[2] == "flex-start" ? "flex-start" : "flex-end",
            });

            // Set bar text properties if flex-direction is column
            $(bars[i].children[0]).css({
                // Align the text left or right dependent on graph alignment
                'text-align' : props[2] == "flex-start" ? "left" : "right",
                // Float the text left or right dependent on graph alignment
                'float' : props[2] == "flex-start" ? "left" : "right",
                // Pad the text left or right dependent on graph alignment
                'padding' : '0px 10px 0px 10px',
                // Set text line height to bar width
                'line-height' : props[5] + 'px',
            });

            //Correct bar width to fit overflowed text
            if($(bars[i]).width() < $(bars[i].children[0]).outerWidth(true))
                $(bars[i]).css({'width' : $(bars[i].children[0]).outerWidth(true) + 'px'});

        }

    }

}

/*
*
* Function for updating a graphs key
*
* parent (string): html id of key wrapper div
* props (array):
*   [0]: name (string): key name
*   [1]: color (string): key color
*
*/
function updateGraphKey(parent, data) {

    // Select all key pairs
    let key = $("#" + parent + " > div").children();

    // Set the name and color for each key pair
    for(let i = 0; i < key.length; i+=2) {

        // Set the key color
        key[i].style.backgroundColor = data[i/2][1];

        // Set the key name
        key[i+1].innerHTML = data[i/2][0];

    }
}




/*
*
*
* DEMO LOGIC ONLY
*
*
 */
function randomData(colors = ["#649CFF", "#FFB264", "#797979"]) {
    let data = [
        {
            name: "You",
            priority: 1,
            count: Math.floor(Math.random()*100),
            color: colors[0],
        },
        {
            name: "Avg. North",
            priority: 2,
            count: Math.floor(Math.random()*100),
            color: colors[1],
        },
        {
            name: "Avg. ResNET",
            priority: 3,
            count: Math.floor(Math.random()*100),
            color: colors[2],
        },
    ];
    return JSON.stringify(data);
}

/*
*
*
* DEMO LOGIC ONLY
*
*
 */
function updateColors() {
    let colors = [];
    $('#colors').children('input').each(function() {
        colors.push(this.value);
        this.style.backgroundColor = this.value;
    });
    if(!colors[0]) colors[0] = "#649CFF";
    if(!colors[1]) colors[1] = "#FFB264";
    if(!colors[2]) colors[2] = "#797979";
    let month = randomData(colors);
    let semester = randomData(colors);
    barGraph(month, ["tickets_month_hori", "column", "flex-end", "200", "25", "50", '', 'key_hori']);
    barGraph(semester, ["tickets_semester_hori", "column", "flex-start", "200", "25", "50", '']);
    barGraph(month, ["tickets_month_vert", "row", "flex-end", "200", "25", "50", '', 'key_vert']);
    barGraph(semester, ["tickets_semester_vert", "row", "flex-end", "200", "25", "50", '']);
}
