var yoco = new window.YocoSDK({
  publicKey: 'pk_test_ed3c54a6gOol69qa7f45',
});
var checkoutButton = document.querySelector('#checkout-button');
checkoutButton.addEventListener('click', function () {
  yoco.showPopup({
    amountInCents:  document.getElementById('total').value,
    currency: 'ZAR',
    callback: function (result) {
      // This function returns a token that your server can use to capture a payment
      if (result.error) {
        var errorMessage = result.error.message;
        console.log(errorMessage);
      } else {
        document.getElementById('token').value = result.id;
      }
      // In a real integration - you would now pass this chargeToken back to your
      // server along with the order/basket that the customer has purchased.
    }
  });
});
