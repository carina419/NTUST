

main()
function main() {
  linearTest();
  //exponetialTest();
}

function linearTest() {
  let x=[0,1,2,3,4,5,6,7,8,9,10]
  let y=[9735,4597,2176,1024,483,229,108,52,24,11,6]
  for(let i = 0; i < x.length; i++) console.log(x[i]+'\t'+y[i])
  let {alpha,beta}=linearRegression(x,y);
  console.log('alpha '+alpha+' beta '+beta);
  console.log('correlation is '+correlation(x, y))
}
function exponetialTest() {
  let X = [0,1,2,3,4,5,6,7,8,9,10];
  let Y =[9735,4597,2176,1024,483,229,108,52,24,11,6];
  let {a,b} = exponentialRegression(X, Y);
  console.log('a '+a+' b '+b)
  X.map(x => console.log(x+'\t'+a*Math.exp(b*x)))
}
function exponentialRegression(X, Y) {
  // y = a*exp(bx) ~ y2=log(y)=log(a)+b*x = alpha+beta*x
  let Y2 = Y.map(val => Math.log(val));
  // solve (x, y2) by linear regression
  let {alpha,beta}=linearRegression(X, Y2);
  let a = Math.exp(alpha), b = beta;
  console.log('a '+a+' b '+b);
  return {a:a, b:b}
}
function linearRegression(x, y) {
  let mx = mean(x), my = mean(y);
  let numer = 0, denom = 0;
  for(let i = 0; i < x.length; i++) {
    numer += (x[i] - mx) * (y[i]-my);
    denom +=  (x[i] - mx)* (x[i] - mx);
  }
  let beta = numer / denom;
  let alpha = my - beta * mx;
  return {alpha:alpha,beta:beta}
}
function mean(x) {
  let sum = 0;
  for(let i = 0; i < x.length; i++) sum += x[i];
  return sum / x.length;
}
function correlation(x, y) {
  let mx = mean(x), my = mean(y);
  let Sxy = 0, Sxx = 0, Syy = 0;
  for(let i = 0; i < x.length; i++) {
    Sxy += (x[i]-mx)*(y[i]-my);
    Sxx += (x[i]-mx)*(x[i]-mx);
    Syy += (y[i]-my)*(y[i]-my);
  }
  return Sxy / Math.sqrt(Sxx*Syy);
}
