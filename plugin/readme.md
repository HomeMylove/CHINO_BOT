定义一个插件

应该解构以下属性


req['groupId'] = body['group_id']
req['rawMsg'] = body['raw_message']
req['msgId'] = body['message_id']
req['msgSeq'] = body['message_seq']
req['msgType'] = body['message_type']
req['postType'] = body['post_type']
req['selfId'] = body['self_id']
req['sender'] = body['sender']
req['subType'] = body['sub_type']
req['time'] = body['time']
req['userId'] = body['user_id']