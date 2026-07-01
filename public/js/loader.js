const words = document.querySelectorAll('.word');

words.forEach((el, index) => {
    el.style.setProperty('--index', index);
});

window.addEventListener('load', function () {
    const loader = document.getElementById('loader');

    if (!sessionStorage.getItem('dashboardLoaded')) {
        var style = document.createElement('style');
        style.innerHTML = '.loader-container { display: flex !important; }';
        document.head.appendChild(style);

        setTimeout (() => {
            if (loader) loader.classList.add('loader-hidden');
            sessionStorage.setItem('dashboardLoaded', 'true');
        }, 2000);  
    } 

    loader.addEventListener('transitioned', () => {
        loader.style.display = 'none';
    })
});