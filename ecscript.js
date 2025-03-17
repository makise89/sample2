let puroducts = document.querySelectorAll('.product');
const cart = document.getElementById('cart');
const main_container = document.querySelector('.main-container');

//お気に入りに登録したときの処理
main_container.addEventListener('click',async (event) => {
    const check = event.target.classList.contains('product');
    if(check){
        const productname = event.target.getAttribute("data-name");
        const productpass = event.target.getAttribute("data-pass");
        const product = {productname,productpass,quantity: 1};
        console.log(product);

        const response = await fetch("/ec/cart",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(product)
        });

        const result = await response.json();
        console.log("カートに追加成功！",result);
    }
})


