(function(){
	window.BigInt.ZERO = new BigInt(0);
	window.BigInt.ONE = new BigInt(1);
	window.BigInt.TWO = new BigInt(2);
	window.BigInt.THREE = new BigInt(3);
	window.BigInt.THEANSWER = new BigInt(42);
	window.BigInt.PRIMES = [
		new BigInt(3),
		new BigInt(7),
		new BigInt(13),
		new BigInt(47),
		new BigInt(73),
		new BigInt(101),
		new BigInt(883),
		new BigInt(2531),
		new BigInt(4481),
		new BigInt(32299),
		new BigInt(130051),
		new BigInt(233267),
		new BigInt(3640909),
		new BigInt(19676717),
		new BigInt(83205011),
		new BigInt(222474463),
		new BigInt('250146970973'),
		new BigInt('2546463813923'),
		new BigInt('6839269182703'),
		new BigInt('10286428730153'),
		new BigInt('132694149007439'),
		new BigInt('413769901072380953'),
		new BigInt('709364612625632432650913'),
		new BigInt('4565942450634530082860177'),
		new BigInt('51951800629850088190383311'),
		new BigInt('472513090645872515149465052411'),
		new BigInt('76285487235109713965939330115191639'),
		new BigInt('6693102488725841461817035690659984518257'),
		new BigInt('59210937384584975864213427526019484565316659'),
		new BigInt('3299672634956653631085567674762073402306723493'),
		new BigInt('567198778129097365266570118936499234397395084783'),
		new BigInt('651271417557711039459424454473029499910068546379'),
		new BigInt('742728711398362170741499690272074900169329336219')
	];
	window.BigInt.PRIMES.random = function(){return window.BigInt.PRIMES[~~(Math.random()*window.BigInt.PRIMES.length)]};
}());
