

const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);


document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document.addEventListener('mouseenter', () => {
    cursor.style.background = 'rgba(255, 255, 255, 0.7)'; 
    cursor.style.boxShadow = '0 0 0 1.2px rgba(0, 0, 0)'
});

document.addEventListener('mouseout', () => {
    cursor.style.background = 'rgba(255, 255, 255, 0.7)';
    cursor.style.boxShadow = '0 0 0 1.2px rgba(0, 0, 0)'
});

document.addEventListener('mouseleave', () => {
    cursor.style.background = 'rgba(255, 255, 255, 0)';
    cursor.style.boxShadow = 'none'
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(1.2)';
    cursor.style.boxShadow = '0 0 0 1.4px rgba(0, 0, 0)'
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.boxShadow = '0 0 0 1.2px rgba(0, 0, 0)'
});    

