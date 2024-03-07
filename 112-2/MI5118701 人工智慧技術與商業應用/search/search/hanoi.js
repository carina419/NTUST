move(3, 'A', 'C', 'B');

function move(n, a, c, b)
{
	if(n == 1) {
		WScript.echo("move " + n + " from " + a + " to " + c);
		return;
	}
	move(n - 1, a, b, c);
	WScript.echo("move " + n + " from " + a + " to " + c);
	move(n - 1, b, c, a);
}
