from obspy import read
import matplotlib.pyplot as plt
import numpy as np
import io
import base64


class Plotter:

	def do_plot(self, data):
		plt.figure()
		fig, ((ax1), (ax2), (ax3)) = plt.subplots(nrows=3, ncols=1) 
		fig.set_figwidth(15) 
		fig.set_figheight(15)

		st = read(f'resources/{data[0]}')
		tr = st[0]
		tr.data = tr.data.astype(np.float64)
		tr.data[tr.data == -1] = np.nan
		ax1.locator_params(nbins=3)
		ax1.set_xlabel('Time', fontsize=14)
		ax1.set_ylabel('DU', fontsize=14)
		ax1.set_yticks(np.linspace(min(tr.data), max(tr.data), 5))
		ax1.set_title('MH1 - (MP sensor)', fontsize=20, fontweight="bold", pad=10)
		ax1.plot(tr.times("matplotlib"), tr.data, "b-")
		ax1.xaxis_date()


		st = read(f'resources/{data[1]}')
		f'resources/{data[1]}'
		tr = st[0]
		print(tr.data)
		tr.data = tr.data.astype(np.float64)
		tr.data[tr.data == -1] = np.nan
		ax2.locator_params(nbins=3)
		ax2.set_xlabel('Time', fontsize=14)
		ax2.set_ylabel('DU', fontsize=14)
		ax2.set_yticks(np.linspace(min(tr.data), max(tr.data), 5))
		ax2.set_title('MH2 - (MP sensor)', fontsize=20, fontweight="bold", pad=10)
		ax2.plot(tr.times("matplotlib"), tr.data, "b-")
		ax2.xaxis_date()


		st = read(f'resources/{data[2]}')
		tr = st[0]
		tr.data = tr.data.astype(np.float64)
		tr.data[tr.data == -1] = np.nan
		ax3.locator_params(nbins=3)
		ax3.set_xlabel('Time', fontsize=14)
		ax3.set_ylabel('DU', fontsize=14)
		ax3.set_yticks(np.linspace(min(tr.data), max(tr.data), 5))
		ax3.set_title('MHZ - (MP sensor)', fontsize=20, fontweight="bold", pad=10)
		ax3.plot(tr.times("matplotlib"), tr.data, "b-")
		ax3.xaxis_date()


		fig.tight_layout(pad=1.5)
		fig.subplots_adjust(hspace=0.3)

		buffer = io.BytesIO()
		fig.savefig(buffer, format="png")
		fig.savefig('file.png')
		buffer.seek(0)
		plt.close()
		
		return base64.b64encode(buffer.read())
