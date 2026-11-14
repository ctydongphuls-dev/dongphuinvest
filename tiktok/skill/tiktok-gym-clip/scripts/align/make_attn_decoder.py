"""Expose the cross-attention weights of the Whisper ONNX decoder as extra outputs."""
import sys, onnx
from onnx import helper, TensorProto
src, dst = sys.argv[1], sys.argv[2]
m = onnx.load(src, load_external_data=False)
names = [n.output[0] for n in m.graph.node if n.op_type == 'Softmax' and '/cross_attn/' in n.name]
print('cross-attn softmax outputs:', len(names))
for nm in names:
    m.graph.output.append(helper.make_tensor_value_info(nm, TensorProto.FLOAT, None))
onnx.save(m, dst)
print('saved', dst)
