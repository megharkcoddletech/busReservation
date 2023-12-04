
let bus1 = document.querySelector('.bus1');
let bus2 = document.querySelector('.bus2');
let img1 = document.querySelector('.img1');
let img2 = document.querySelector('.img2');
let s1 = document.querySelector('.s1');
let tm = document.querySelector('.tm');
let busb1 = document.querySelector('.busb1');
let table = document.querySelector('.table');
let tamount = document.querySelector('.tamount');
let t = document.querySelector('.t');
let totalAmount = 0;
let amount = document.querySelector('span');
let select = document.querySelector('.select');
let b1 = document.querySelector('.b1');
let b2 = document.querySelector('.b2');
let book = document.querySelector('.book');
let count =0;


const seatArray = [];
const offer = [];
const seatID = [];
let offerCost = 0;
bus1.addEventListener('click', () => {
    b2.style.display = 'none';
    select.style.display = 'block';
    img1.style.display = 'block';
    s1.style.display = 'block';
    const url = 'http://localhost:3001/user/viewSeats';
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            seatArray.push(data.message);

    for (let i = 0; i < seatArray.length; i++) {
    for (let j = 0; j < seatArray[i].length; j++) {
        const seat = seatArray[i][j];
        if (seat.bus_id === 1 ) {
            if(seat.offerPrice ===0 ) { 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="width: 150px">${seat.id}</td>
                <td class="seatType">${seat.seat_type}</td>
                <td><button style="background-color: green;"><span class="spanele">${seat.seatCost}</span></button></td>
                <td class="offData"> </td>
            `;      
        
            table.appendChild(row);

            const button = row.querySelector('button');
            button.addEventListener('click', () => {
                button.style.backgroundColor = 'red';
                seatID.push(seat.id);
                totalAmount +=  seat.seatCost;
                amount.textContent = totalAmount;
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="width: 150px">${seat.id}</td>
                <td class="seatType">${seat.seat_type}</td>
                <td><span class="spanele" style="text-decoration: line-through">${(seat.seatCost)}</span></td>
                <td class="offData"><button style="background-color: green;">${(seat.offerPrice)}</button> </td>
            `;        
            table.appendChild(row);

            const button = row.querySelector('button');
            button.addEventListener('click', () => {
                button.style.backgroundColor = 'red';
                seatID.push(seat.id);
                if(seat.offerPrice === 0){ 
                totalAmount +=  seat.seatCost;
            } else {
                totalAmount+= seat.offerPrice;
            }
                amount.textContent = totalAmount;
            });
        }
        }
    }
}

        })
        .catch(error => {
            console.log('Error:', error);
        });
});




