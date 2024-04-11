
var momentum = true;

main();



function main() {

  let W = 3, B = -2; // ground truths

  let x = new Array(100), y = new Array(100);

  for(let i = 0; i < x.length; i++) {

    x[i] = Math.random() * 100;

    y[i] = W * x[i] + B + (Math.random()-0.5)*1; // with error

  }

  // if(true)return;

  let w=Math.random()-0.5, b = Math.random();

  let eps = 1e-5, prevLoss = 1, counter = 0;

  let _w = 0, _b = 0, __w = 0, __b = 0;



  for(let epoch = 1; epoch <= 5000; epoch++) {

    iterationGD(epoch);

    // iterationSGD(epoch);

  }

  function iterationGD(epoch) {

    let loss = 0;

    for(let i = 0; i < x.length; i++) {

      let _y = w * x[i] + b; // forward

      let error = y[i] - _y; // grad

      loss += error * error;

      let grad = 2 * error; // back prop

      w += eps * grad * x[i];

      b += eps * grad;

    }

    loss /= x.length;

    // if(epoch % 1000 == 0)

    console.log(epoch+'\t'+loss+'\tw='+w+'\tb='+b)

    prevLoss = loss;

  }



  function iterationSGD(epoch, batchSize=32) {

    let loss = 0;

    for(let i = 0; i < x.length; i++) {

      let _y = w * x[i] + b; // forward

      let error = y[i] - _y; // grad

      loss += error * error;

      let grad = error; // back prop

      _w += grad * x[i];

      _b += grad;

      if(++counter % batchSize == 0) {

        _w /= batchSize;

        _b /= batchSize;

        if(momentum && __w * _w > 0) _w += __w;

        if(momentum && __b * _b > 0) _b += __b;

        w += eps * _w;

        b += eps * _b;

        __w = _w;

        __b = _b;

        _w = 0;

        _b = 0;

      }

    }

    loss = Math.sqrt(loss/x.length);

    if(epoch % 1000 == 0) console.log(epoch+'\t'+loss+'\tw='+w+'\tb='+b)

    prevLoss = loss;

  }

}

