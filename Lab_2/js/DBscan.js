function DBscan(D, eps, t_eps, MinPts){
	var clusters = new Array();
	var C = 0;

	D.forEach(function(P){
		if(P.visited) {
			return;
		}

		P.visited = true;
		var NeighbourPts = regionQuery(P, eps, t_eps);

		if(NeighbourPts.length < MinPts){
			P.noise = true;
		} else {
			clusters[C] = expandCluster(P, NeighbourPts, eps, MinPts);
			C++;
		}
	})

	return clusters;

	function expandCluster(P, NeighbourPts, eps, MinPts){
		var cluster = new Array();
		cluster.push(P);
		P.hasCluster = true;

		NeighbourPts.forEach(function(P1){
			if(!P1.visited){
				P1.visited = true;

				var NeighbourPts1 = regionQuery(P1, eps, t_eps);
				if(NeighbourPts1.length >= MinPts){
					NeighbourPts = NeighbourPts.concat(NeighbourPts1);
				}
			}
			if(!P1.hasCluster){
				cluster.push(P1);
			}
		})

		return cluster;
	}


	function regionQuery(P, eps, t_eps){
		var neighbours = new Array();

		D.forEach(function(d){
			var dist = distance(d, P);
			var timeDist = Math.abs(d.value - P.value);
			if(dist < eps && timeDist < t_eps)
				neighbours.push(d);
		})
		
		return neighbours;
	}

	function distance(p1, p2){
		//return Math.abs(p1.value - p2.value);
		//Math.pow(+p1.value - +p2.value, 2)
		return Math.sqrt(Math.pow(+p1.x - +p2.x, 2) + Math.pow(+p1.y - +p2.y, 2)); //  + Math.pow(+p1.value - +p2.value, 2));
	}
}